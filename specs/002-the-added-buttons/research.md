# Research: Button Sizing Standards

## Overview
Research findings for standardizing speed control button dimensions in the DailyDictation userscript.

## CSS Button Sizing Analysis

### Current Implementation Issues
- **Decision**: Buttons currently use `padding: "5px 10px"` which creates variable widths based on text content
- **Rationale**: Text content varies ("0.25" vs "0.5" vs "0.6" vs "1.0") causing different button widths
- **Problem**: Inconsistent visual appearance due to content-based sizing

### Standardization Approach
- **Decision**: Apply explicit `width` and `height` CSS properties with `box-sizing: border-box`
- **Rationale**: Fixed dimensions ensure visual consistency regardless of text content
- **Implementation**: Use inline CSS styling within existing button creation logic

### Recommended Button Dimensions
- **Decision**: 50px width × 32px height 
- **Rationale**: 
  - Accommodates longest text ("0.25") with comfortable padding
  - Maintains visual proportions with existing 5px margins
  - Provides adequate click target size (minimum 32px recommended)
- **Alternatives considered**: 
  - Auto-width with min-width: Creates uneven spacing
  - Equal padding approach: Still content-dependent
  - CSS grid/flexbox: Violates single-file simplicity principle

### Text Alignment
- **Decision**: `text-align: center` with `line-height` matching button height
- **Rationale**: Centers variable-length text within fixed button dimensions
- **Implementation**: Apply to all speed control buttons

### Visual Feedback Consistency
- **Decision**: Maintain existing color-based feedback with standardized dimensions
- **Rationale**: Current hover/active/selected states work well, just need consistent sizing
- **Approach**: Preserve backgroundColor and color changes within new dimensions

## Technical Requirements

### CSS Properties to Apply
```css
width: 50px
height: 32px
box-sizing: border-box
text-align: center  
line-height: 32px
padding: 0  /* Remove content-based padding */
```

### Integration Points
- Modify button creation in `setupControls()` function
- Apply to all speed buttons (0.25x, 0.5x, 0.6x, 1.0x)
- Maintain existing margin and cursor properties
- Preserve hover/active/selected state styling

### Browser Compatibility
- **Decision**: Use standard CSS properties with broad browser support
- **Rationale**: Target browsers (Chrome, Firefox, Safari, Edge) all support these properties
- **Fallback**: Not needed - these are basic CSS properties

## Implementation Strategy

### Code Location
- **Target**: Button creation loop in `setupControls()` function around line 47
- **Approach**: Add standardized CSS properties to existing button.style assignments
- **Impact**: Minimal - only affects visual presentation, no functional changes

### Testing Approach  
- **Method**: Manual testing on https://dailydictation.com with Tampermonkey
- **Verification**: Visual inspection of button consistency
- **Success Criteria**: All buttons identical width/height, text properly centered

## Conclusion

This is a low-risk, high-value improvement that enhances UI consistency without affecting functionality. The approach aligns perfectly with constitutional principles and requires minimal code changes within the existing userscript architecture.