import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from '@tanstack/react-query';

import { queryKeys, STALE_TIME } from '@/lib/query-client';
import type {
  Season,
  SeasonDefinition,
  SeasonsResponse,
  UpdateSeasonInput,
  SeasonQueryParams,
} from '@/schemas';
import { seasonService } from '@/services';

// ============================================================================
// QUERY HOOKS
// ============================================================================

/**
 * Fetch paginated list of seasons
 *
 * @param params - Query parameters for filtering and pagination
 * @param options - Additional React Query options
 *
 * @example
 * const { data, isLoading } = useSeasons({ year: 2026 });
 */
export function useSeasons(
  params?: SeasonQueryParams,
  options?: Omit<UseQueryOptions<SeasonsResponse>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.seasons.list(params),
    queryFn: () => seasonService.getAll(params),
    staleTime: STALE_TIME.LONG,
    ...options,
  });
}

/**
 * Fetch a single season by ID
 *
 * @param id - Season ID
 * @param options - Additional React Query options
 *
 * @example
 * const { data: season } = useSeason(1);
 */
export function useSeason(
  id: number,
  options?: Omit<UseQueryOptions<Season>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.seasons.detail(id),
    queryFn: () => seasonService.getById(id),
    enabled: !!id,
    staleTime: STALE_TIME.LONG,
    ...options,
  });
}

/**
 * Fetch the current active season
 *
 * @param options - Additional React Query options
 *
 * @example
 * const { data: currentSeason } = useCurrentSeason();
 */
export function useCurrentSeason(
  options?: Omit<UseQueryOptions<Season | null>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.seasons.current(),
    queryFn: seasonService.getCurrent,
    staleTime: STALE_TIME.MEDIUM,
    ...options,
  });
}

/**
 * Fetch all season definitions
 *
 * @param options - Additional React Query options
 *
 * @example
 * const { data: definitions } = useSeasonDefinitions();
 * // Returns: [{ id: 1, code: 'SPRING', name: 'Xuân' }, ...]
 */
export function useSeasonDefinitions(
  options?: Omit<
    UseQueryOptions<SeasonDefinition[]>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: queryKeys.seasons.definitions(),
    queryFn: seasonService.getDefinitions,
    staleTime: STALE_TIME.STATIC,
    ...options,
  });
}

// ============================================================================
// MUTATION HOOKS
// ============================================================================

/**
 * Create a new season
 *
 * @example
 * const createMutation = useCreateSeason();
 * createMutation.mutate({
 *   season_definition_id: 1,
 *   year: 2026,
 *   start_date: '2026-02-01',
 *   end_date: '2026-04-30',
 * });
 */
export function useCreateSeason() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: seasonService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.seasons.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.seasons.current(),
      });
    },
  });
}

/**
 * Update an existing season
 *
 * Features:
 * - Optimistic updates
 * - Automatic rollback on error
 *
 * @example
 * const updateMutation = useUpdateSeason();
 * updateMutation.mutate({
 *   id: 1,
 *   data: { notes: 'Ghi chú mới' },
 * });
 */
export function useUpdateSeason() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateSeasonInput }) => seasonService.update(id, data),
    onMutate: async ({ id, data }): Promise<{ previousSeason: Season | undefined }> => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.seasons.detail(id),
      });

      const previousSeason = queryClient.getQueryData<Season>(
        queryKeys.seasons.detail(id)
      );

      if (previousSeason) {
        queryClient.setQueryData<Season>(queryKeys.seasons.detail(id), {
          ...previousSeason,
          ...data,
        });
      }

      return { previousSeason };
    },
    onError: (_error, variables, context) => {
      if (context?.previousSeason) {
        queryClient.setQueryData(
          queryKeys.seasons.detail(variables.id),
          context.previousSeason
        );
      }
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.seasons.detail(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.seasons.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.seasons.current(),
      });
    },
  });
}

/**
 * Delete a season
 *
 * @example
 * const deleteMutation = useDeleteSeason();
 * deleteMutation.mutate(1);
 */
export function useDeleteSeason() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: seasonService.delete,
    onMutate: async (id): Promise<{ previousLists: [queryKey: readonly unknown[], data: SeasonsResponse | undefined][] }> => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.seasons.lists(),
      });

      const previousLists = queryClient.getQueriesData<SeasonsResponse>({
        queryKey: queryKeys.seasons.lists(),
      });

      previousLists.forEach(([queryKey, data]) => {
        if (data?.data) {
          queryClient.setQueryData<SeasonsResponse>(queryKey, {
            ...data,
            data: data.data.filter((season) => season.id !== id),
          });
        }
      });

      return { previousLists };
    },
    onError: (_error, _id, context) => {
      context?.previousLists.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.seasons.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.seasons.current(),
      });
    },
  });
}

/**
 * Toggle active status of a season
 *
 * @example
 * const toggleMutation = useToggleSeasonActive();
 * toggleMutation.mutate({ id: 1, isActive: true });
 */
export function useToggleSeasonActive() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
      seasonService.toggleActive(id, isActive),
    onMutate: async ({ id, isActive }): Promise<{ previousSeason: Season | undefined }> => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.seasons.detail(id),
      });

      const previousSeason = queryClient.getQueryData<Season>(
        queryKeys.seasons.detail(id)
      );

      if (previousSeason) {
        queryClient.setQueryData<Season>(queryKeys.seasons.detail(id), {
          ...previousSeason,
          is_active: isActive,
        });
      }

      return { previousSeason };
    },
    onError: (_error, variables, context) => {
      if (context?.previousSeason) {
        queryClient.setQueryData(
          queryKeys.seasons.detail(variables.id),
          context.previousSeason
        );
      }
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.seasons.detail(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.seasons.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.seasons.current(),
      });
    },
  });
}

// ============================================================================
// PREFETCH HELPERS
// ============================================================================

/**
 * Prefetch seasons list
 */
export async function prefetchSeasons(
  queryClient: ReturnType<typeof useQueryClient>,
  params?: SeasonQueryParams
) {
  await queryClient.prefetchQuery({
    queryKey: queryKeys.seasons.list(params),
    queryFn: () => seasonService.getAll(params),
  });
}

/**
 * Prefetch a single season
 */
export async function prefetchSeason(
  queryClient: ReturnType<typeof useQueryClient>,
  id: number
) {
  await queryClient.prefetchQuery({
    queryKey: queryKeys.seasons.detail(id),
    queryFn: () => seasonService.getById(id),
  });
}

/**
 * Prefetch season definitions (static data)
 */
export async function prefetchSeasonDefinitions(
  queryClient: ReturnType<typeof useQueryClient>
) {
  await queryClient.prefetchQuery({
    queryKey: queryKeys.seasons.definitions(),
    queryFn: seasonService.getDefinitions,
  });
}
