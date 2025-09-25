# Quickstart: Testing Button Standardization

## Prerequisites
- Browser with Tampermonkey extension installed
- DailyDictation userscript (script.js) loaded in Tampermonkey

## Manual Testing Steps

### 1. Install/Update Script
1. Open Tampermonkey dashboard
2. Update script.js with button sizing changes
3. Ensure script is enabled for https://dailydictation.com/*

### 2. Navigate to Test Site
1. Go to https://dailydictation.com
2. Navigate to any page with audio content (lessons/exercises)
3. Wait for audio element to load and speed controls to appear

### 3. Visual Verification
**Expected Results:**
- All 4 speed buttons (0.25, 0.5, 0.6, 1.0) should have identical dimensions
- Buttons should be visually aligned with consistent spacing
- Text should be centered within each button
- Button heights should match perfectly

**Check Points:**
- [ ] All buttons same width
- [ ] All buttons same height  
- [ ] Text properly centered in each button
- [ ] Consistent spacing between buttons
- [ ] No visual regression in button alignment

### 4. Functional Verification
**Test Interactions:**
1. Click each speed button - verify audio speed changes
2. Use [ and ] keyboard shortcuts - verify speed changes and button highlighting
3. Hover over buttons - verify hover effects still work
4. Test active/selected button highlighting

**Expected Results:**
- [ ] All functionality preserved (clicking buttons changes speed)
- [ ] Keyboard shortcuts still work ([ decreases, ] increases)  
- [ ] Visual feedback consistent across all buttons
- [ ] Selected button properly highlighted
- [ ] Hover effects work on all buttons

### 5. Browser Compatibility
Test in multiple browsers if possible:
- [ ] Chrome with Tampermonkey
- [ ] Firefox with Tampermonkey/Greasemonkey
- [ ] Edge with Tampermonkey

### 6. Error Verification
Check browser console for:
- [ ] No JavaScript errors after loading
- [ ] Speed change messages still logged correctly
- [ ] No CSS-related warnings

## Success Criteria
✅ All buttons have consistent visual dimensions  
✅ All existing functionality preserved  
✅ No console errors or warnings  
✅ Professional, polished appearance

## Troubleshooting

### Buttons Still Different Sizes
- Verify CSS properties were applied correctly
- Check if padding was removed from button styles
- Ensure box-sizing: border-box is set

### Text Not Centered
- Verify text-align: center is applied
- Check line-height matches button height
- Ensure padding is set to 0

### Functionality Broken  
- Check if existing event listeners were preserved
- Verify currentIndex logic wasn't modified
- Test keyboard shortcuts separately from button clicks

## Rollback Plan
If issues occur:
1. Revert to previous script.js version
2. Test original functionality restored
3. Investigate issues before reapplying changes