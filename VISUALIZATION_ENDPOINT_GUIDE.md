# Chart Visualization API Endpoint

## Overview

A new API endpoint has been created specifically for chart visualization components in the frontend. This endpoint provides optimized data formatting for visualization needs while maintaining compatibility with the existing base chart structure.

## New Backend Endpoint

### `/api/v1/profiles/{profile_id}/visualization`

**Method:** GET  
**Authentication:** Required (Bearer token)  
**Purpose:** Retrieve base chart data optimized for visualization components

#### Features:
- **Same data structure** as the base chart endpoint
- **Additional optimization** with query parameters for data size control
- **Visualization metadata** included in response
- **Client-side caching** with ETag support
- **Error handling** and fallback support

#### Query Parameters:
- `include_aspects` (boolean, default: false) - Include detailed astrological aspects
- `include_channels` (boolean, default: false) - Include detailed Human Design channels

#### Response Format:
```json
{
  "status": "success",
  "data": {
    // Standard base chart data structure
    "metadata": { ... },
    "hd_type": "...",
    "energy_family": { ... },
    "processing_core": { ... },
    // ... other synthesis categories
    
    // Additional visualization metadata
    "visualization_metadata": {
      "optimized_for_visualization": true,
      "includes_aspects": false,
      "includes_channels": false,
      "api_version": "v1"
    }
  }
}
```

## Frontend Integration

### Updated Services

#### `blueprintVisualizerService.ts`
- **`fetchVisualizationData(userId)`** - Fetch from the new visualization endpoint
- **`getOptimizedVisualizationData(userId, useVisualizationEndpoint)`** - Smart method that can use either endpoint
- **`prepareVisualizationData(chartData)`** - Convert data to visualization format (existing)

#### Example Usage:
```typescript
// Use the new visualization endpoint
const result = await blueprintVisualizerService.getOptimizedVisualizationData(userId, true);

// Fallback to base chart if needed
const result = await blueprintVisualizerService.getOptimizedVisualizationData(userId, false);
```

### Updated Components

#### `EnergeticBlueprintScreen.tsx`
- Now attempts to use the visualization endpoint first
- Falls back to base chart service if visualization endpoint fails
- Maintains backward compatibility

## Benefits

1. **Performance Optimization**
   - Smaller response sizes when aspects/channels not needed
   - Faster loading for visualization components

2. **Future Extensibility**
   - Dedicated endpoint for visualization-specific enhancements
   - Can add visualization-specific computed fields

3. **Backward Compatibility**
   - Existing components continue to work
   - Graceful fallback to base chart service

4. **Development Flexibility**
   - Can toggle between endpoints for testing
   - Easy to compare performance and data structures

## Testing

Use the provided test script to verify the endpoint:
```bash
node test-visualization-endpoint.js
```

This script will:
- Test health endpoints
- Compare base chart vs visualization endpoint responses
- Verify data structure and metadata
- Check response sizes and optimization

## Implementation Files

### Backend (Reality Creation Profile Engine)
- `src/api/endpoints/chart_visualization.py` - New endpoint implementation
- `src/api/router.py` - Router registration

### Frontend (RcpeExpoApp)
- `src/services/blueprintVisualizerService.ts` - Enhanced service
- `src/screens/Main/EnergeticBlueprintScreen.tsx` - Updated screen
- `test-visualization-endpoint.js` - Test script

## Next Steps

1. **Test the endpoint** with the provided test script
2. **Deploy the backend changes** to ensure the new endpoint is available
3. **Monitor performance** and compare with base chart endpoint
4. **Add additional visualization optimizations** as needed
5. **Consider caching strategies** for improved performance
