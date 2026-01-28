# 🌱 Soleil Farm

A domain-driven farm management system inspired by the Soleil Hostel project.

This project is designed for a small family farm (~2400m²) located in a rural mountainous area,
with mixed terrain including rice fields, garden land, and natural water sources (streams).

The goal is to build a long-term, maintainable system to manage land, water, crops, and seasonal activities
— starting small, but architected to grow.

---

## 🎯 Vision

- Treat **land, water, and time** as first-class domain entities
- Focus on **long-term sustainability**, not short-term yield only
- Keep the system **simple enough for a family farm**
- Apply **software engineering best practices** to real-world farming

---

## 🧠 Core Domain Concepts

### 1. LandParcel
Represents a physical piece of land.

Examples:
- Rice field (front area)
- Garden land near the house
- Hillside land
- Riverside land

Key attributes:
- Area (m²)
- Terrain type
- Soil characteristics
- Current usage

---

### 2. WaterSource
Represents natural or artificial water sources.

Examples:
- Stream behind the garden
- Irrigation channel
- Rainwater collection

Key attributes:
- Type (stream, canal, rain)
- Availability (seasonal / year-round)
- Connected land parcels

---

### 3. CropCycle
Represents a farming cycle for a specific crop.

Examples:
- Rice season (Spring–Summer)
- Vegetable rotation
- Tree planting cycle

Key attributes:
- Crop type
- Start date / end date
- Associated land parcels
- Expected vs actual yield

---

### 4. Season
Represents seasonal context.

Examples:
- Dry season
- Rainy season
- Flood-prone period

Used to:
- Plan crop cycles
- Assess risks
- Compare historical performance

---

### 5. ActivityLog (Audit Log)
Represents actions taken on the farm.

Examples:
- Planted rice
- Cleaned irrigation channel
- Improved soil
- Harvested crops

Purpose:
- Traceability
- Learning from past seasons
- Long-term optimization

---

## 🏗️ Architectural Principles

- Domain-Driven Design (DDD)
- Clear separation of concerns
- Auditability by default
- Mobile-first mindset
- Start simple, evolve safely

---

## 🚧 Project Status

**Phase 0 – Domain Definition**
- [x] Define core domain concepts
- [ ] Create initial domain model
- [ ] Setup project skeleton

---

## 📌 Notes

This project prioritizes **correct modeling of reality** over premature features.
Code comes after clarity.

