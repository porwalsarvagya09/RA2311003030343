# Vehicle Maintenance Scheduler - System Design Document

## 1. System Overview

The Vehicle Maintenance Scheduler is a microservice-based application that optimizes maintenance task scheduling for vehicle fleets. It uses a weighted knapsack algorithm to select the optimal combination of maintenance tasks that maximizes operational impact while respecting mechanic hour constraints.

### Key Objectives
- **Efficiency**: Maximize vehicle uptime by prioritizing high-impact tasks
- **Constraint Compliance**: Never exceed available mechanic hours
- **Scalability**: Support multiple depots and hundreds of vehicles
- **Traceability**: Log all scheduling decisions for audit purposes

---

## 2. Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│           Frontend (React/Vue)                       │
│  - Scheduler Dashboard                               │
│  - Results Visualization                             │
│  - Screenshot/Export                                 │
└──────────────────┬──────────────────────────────────┘
                   │ HTTP REST API
┌──────────────────▼──────────────────────────────────┐
│        Node.js Express Backend                       │
├─────────────────────────────────────────────────────┤
│ Routes              │ Controllers         │ Services │
│ ─────────────────────────────────────────────────── │
│ /api/scheduler/*    │ schedulerController │ apiServ. │
│ /api/depot/*        │ depotController     │ scheduler│
│                     │                     │ Service  │
├─────────────────────────────────────────────────────┤
│  Middleware: Logging, Auth, Error Handling          │
├─────────────────────────────────────────────────────┤
│  Utilities: Knapsack Algorithm, Validators          │
└──────────────────┬──────────────────────────────────┘
                   │
         ┌─────────┼─────────┐
         ▼         ▼         ▼
    ┌────────┐ ┌────────┐ ┌────────┐
    │ Depot  │ │Vehicle │ │Logging │
    │  API   │ │  API   │ │  DB    │
    └────────┘ └────────┘ └────────┘
```

---

## 3. Core Algorithm: Weighted Knapsack

### Problem Definition
```
Maximize:  Σ(importance_i) for selected tasks
Subject to: Σ(duration_i) ≤ available_hours
```

### Algorithm Selection
- **Dynamic Programming** - O(n*W) complexity
- **Why DP?** Optimal substructure, overlapping subproblems
- **Limitations**: Works well for up to 10,000 tasks and 100,000 hours

### Implementation Steps
1. Initialize DP table: `dp[tasks.length][capacity]`
2. Build table bottom-up
3. Backtrack to find selected tasks
4. Return selected tasks with total metrics

---

## 4. Data Models

### Depot
```javascript
{
  id: Number,
  name: String,
  mechanic_hours: Number,  // Available capacity
  location: String,
  created_at: Date
}
```

### Vehicle Task
```javascript
{
  task_id: String,           // Unique identifier
  vehicle_id: String,        // Which vehicle
  duration: Number,          // Hours required
  importance: Number,        // 1-10 priority score
  task_type: String,         // 'oil_change', 'inspection', etc
  created_at: Date
}
```

### Scheduling Result
```javascript
{
  depot_id: Number,
  schedule_id: String,       // UUID
  selected_tasks: [Task],    // Array of selected tasks
  total_duration: Number,
  total_importance: Number,
  hours_remaining: Number,
  scheduled_at: Date
}
```

---

## 5. API Endpoints

### External APIs (Provided)

#### GET `/evaluation-service/depots`
Returns available depots and mechanic hours.

#### GET `/evaluation-service/vehicles`
Returns vehicle maintenance tasks.

### Internal APIs (To Build)

#### GET `/api/scheduler/optimize?depot_id=1`
Runs optimization algorithm.

**Response**:
```json
{
  "depot_id": 1,
  "schedule_id": "sch-123-456",
  "selected_tasks": [...],
  "total_duration": 45,
  "total_importance": 42,
  "hours_remaining": 15
}
```

#### GET `/api/depots`
Returns cached depot list.

#### GET `/api/tasks`
Returns cached vehicle tasks.

#### POST `/api/scheduler/export`
Export schedule as PDF/CSV.

---

## 6. Logging Strategy

### Middleware Logging
- **Request**: Method, URL, Query Params, User
- **Response**: Status Code, Response Time
- **Error**: Stack Trace, Error Details

### Business Logic Logging
- Algorithm start/end with input parameters
- Selected tasks and scores
- Decisions and trade-offs
- Performance metrics

### Log Format
```
[TIMESTAMP] [LEVEL] [MODULE] [MESSAGE]
2026-05-02T10:30:45.123Z | INFO | scheduler | Starting optimization for depot 1 with 15 tasks
2026-05-02T10:30:45.234Z | DEBUG | knapsack | Built DP table in 12ms
2026-05-02T10:30:45.245Z | INFO | scheduler | Selected 8 tasks, importance: 42, duration: 45/60
```

---

## 7. Error Handling

### API Errors
- **400**: Invalid parameters (missing depot_id, invalid duration)
- **404**: Depot/Task not found
- **503**: External API unavailable
- **500**: Scheduler algorithm failure

### Graceful Degradation
- If external API fails: Use cached data
- If algorithm timeout: Return empty schedule with warning
- If partial data: Return partial results with warning

---

## 8. Performance Considerations

### Optimization
- Cache depot and vehicle data (30-minute TTL)
- Pre-compute for frequently accessed depots
- Implement request throttling

### Scalability
- Current DP algorithm: O(n*W) = suitable for n<10k, W<100k
- Future: Consider genetic algorithms for very large datasets

### Monitoring
- Track algorithm execution time
- Monitor API response times
- Alert on cache misses

---

## 9. Security Considerations

- Validate all inputs
- Sanitize API responses
- Rate limiting on endpoints
- Authentication for future multi-tenant support
- Audit logging for compliance

---

## 10. Development Phases

| Phase | Focus | Timeline |
|-------|-------|----------|
| 1 | Project setup, file structure | Day 1 |
| 2 | Knapsack algorithm, tests | Day 1-2 |
| 3 | Logging middleware | Day 2 |
| 4 | Scheduler service | Day 2-3 |
| 5 | API integration | Day 3 |
| 6 | Routes & Controllers | Day 3 |
| 7 | Frontend dashboard | Day 4 |
| 8 | Testing, documentation, deploy | Day 4-5 |

---

## 11. Success Metrics

- ✅ Algorithm selects optimal tasks (verified by tests)
- ✅ Response time < 500ms for 1000 tasks
- ✅ Zero task duplicate scheduling
- ✅ 100% API error handling
- ✅ All decisions logged
- ✅ Frontend displays clear results

---

## 12. Future Enhancements

1. **Multi-depot optimization** - Schedule across multiple depots
2. **Vehicle preferences** - Some tasks must be together
3. **Mechanic specialization** - Different mechanics have different skills
4. **Time windows** - Tasks must complete by certain times
5. **Machine learning** - Predict task importance based on history
6. **Real-time updates** - Dynamic scheduling as new tasks arrive
