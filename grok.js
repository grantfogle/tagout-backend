// Finding the low index of the target element
let findLowIndex = function(nums, target) {
    let low = 0;
    let high = nums.length - 1;
    let mid = Math.floor(high / 2);
  
    while (low <= high) {
  
      let midElem = nums[mid];
  
      // Target value is less than the middle value
      if (midElem < target) {
        low = mid + 1;
      } else {
        // Target value is greater than or equal to the middle value
        high = mid - 1;
      }
      // Updating the mid value
      mid = low + Math.floor((high - low) / 2);
    }
    
    if (low < nums.length && nums[low] === target) {
      return low;
    }
  
    return -1;
  };
  // Finding the high index of the target element
  let findHighIndex = function(nums, target) {
    let low = 0;
    let high = nums.length - 1;
    let mid = Math.floor(high / 2);
  
    while (low <= high) {
      let midElem = nums[mid];
      
      //Target value is less than or equal to the middle value
      if (midElem <= target) {
        low = mid + 1;
      } 
      // Target value is greater than the middle value
      else {
        high = mid - 1;
      }
      // Updating the mid value
      mid = low + Math.floor((high - low) / 2);
    }
  
    if (high === -1){
      return high
    }
    
    if (high < nums.length && nums[high] === target) {
      return high;
    }
  
    return -1;
  };