/**
 * useOfflineMutation Hook
 * =======================
 * A wrapper around React Query mutations that supports offline queuing.
 * Automatically queues mutations when offline and syncs when back online.
 */

import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import { useCallback } from 'react';
import { syncQueue, type ResourceType } from './sync-queue';
import { useIsOnline } from './use-online-status';

export interface OfflineMutationOptions<TData, TError, TVariables> {
  /** Resource type for sync queue categorization */
  resource: ResourceType;
  /** API endpoint for the mutation */
  endpoint: string | ((variables: TVariables) => string);
  /** Mutation type */
  type: 'create' | 'update' | 'delete';
  /** Online mutation function */
  mutationFn: (variables: TVariables) => Promise<TData>;
  /** Function to generate optimistic data */
  optimisticData?: (variables: TVariables) => TData;
  /** React Query mutation options */
  queryOptions?: Omit<UseMutationOptions<TData, TError, TVariables>, 'mutationFn'>;
}

export interface UseOfflineMutationResult<TData, TError, TVariables> {
  /** The underlying mutation result */
  mutation: UseMutationResult<TData, TError, TVariables>;
  /** Whether the app is currently online */
  isOnline: boolean;
  /** Whether the last mutation was queued for offline sync */
  wasQueued: boolean;
  /** Execute the mutation */
  mutate: UseMutationResult<TData, TError, TVariables>['mutate'];
  /** Execute the mutation async */
  mutateAsync: UseMutationResult<TData, TError, TVariables>['mutateAsync'];
  /** Whether the mutation is pending */
  isPending: boolean;
  /** Whether the mutation was successful */
  isSuccess: boolean;
  /** Whether the mutation had an error */
  isError: boolean;
  /** The error if any */
  error: TError | null;
  /** The data from the mutation */
  data: TData | undefined;
}

/**
 * Hook for mutations that support offline queuing
 */
export function useOfflineMutation<TData = unknown, TError = Error, TVariables = void>(
  options: OfflineMutationOptions<TData, TError, TVariables>
): UseOfflineMutationResult<TData, TError, TVariables> {
  const isOnline = useIsOnline();

  const getEndpoint = useCallback(
    (variables: TVariables): string => {
      if (typeof options.endpoint === 'function') {
        return options.endpoint(variables);
      }
      return options.endpoint;
    },
    [options.endpoint]
  );

  const mutation = useMutation<TData, TError, TVariables>({
    ...options.queryOptions,
    mutationFn: async (variables) => {
      // If online, execute normally
      if (isOnline) {
        return options.mutationFn(variables);
      }

      // If offline, queue the mutation
      const endpoint = getEndpoint(variables);
      syncQueue.add({
        type: options.type,
        resource: options.resource,
        endpoint,
        data: variables,
      });

      // Return optimistic data if available
      if (options.optimisticData) {
        return options.optimisticData(variables);
      }

      // Return a placeholder response
      return { success: true, queued: true } as unknown as TData;
    },
  });

  return {
    mutation,
    isOnline,
    wasQueued: !isOnline && mutation.isSuccess,
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
    data: mutation.data,
  };
}

/**
 * Factory function to create typed offline mutation hooks
 */
export function createOfflineMutation<TData, TVariables>(
  config: Omit<OfflineMutationOptions<TData, Error, TVariables>, 'queryOptions'>
) {
  return function useTypedOfflineMutation(
    queryOptions?: Omit<UseMutationOptions<TData, Error, TVariables>, 'mutationFn'>
  ) {
    return useOfflineMutation<TData, Error, TVariables>({
      ...config,
      queryOptions,
    });
  };
}
