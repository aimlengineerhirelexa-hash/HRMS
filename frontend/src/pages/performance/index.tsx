import PerformanceManagement from './PerformanceManagement';
import GoalsOKRs from './GoalsOKRs';
import PerformanceReviews from './PerformanceReviews';
import RatingsScores from './RatingsScores';
import Calibration from './Calibration';

export { 
  PerformanceManagement,
  GoalsOKRs, 
  PerformanceReviews,
  RatingsScores,
  Calibration
};

// Legacy exports for backward compatibility
export const AppraisalHistory = () => PerformanceManagement;