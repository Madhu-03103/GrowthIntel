"""
ML Prediction Service for Employee Growth Intelligence
"""
import joblib
import numpy as np
import pandas as pd
from typing import Dict, List, Tuple
import os

class GrowthPredictor:
    """Predict employee growth scores and promotion readiness"""
    
    def __init__(self, model_path='../ml/models'):
        self.model_path = model_path
        self.growth_model = None
        self.promotion_model = None
        self.growth_features = None
        self.promotion_features = None
        self.load_models()
    
    def load_models(self):
        """Load trained models from disk"""
        try:
            self.growth_model = joblib.load(f'{self.model_path}/growth_model.joblib')
            self.promotion_model = joblib.load(f'{self.model_path}/promotion_model.joblib')
            self.growth_features = joblib.load(f'{self.model_path}/growth_features.joblib')
            self.promotion_features = joblib.load(f'{self.model_path}/promotion_features.joblib')
            print("✓ Models loaded successfully")
        except FileNotFoundError:
            print("⚠️  Models not found. Please train models first.")
    
    def prepare_features(self, employee_data: Dict, feature_list: List[str]) -> np.ndarray:
        """Prepare feature vector for prediction"""
        features = []
        for feature in feature_list:
            features.append(employee_data.get(feature, 0))
        return np.array(features).reshape(1, -1)
    
    def predict_growth(self, employee_data: Dict) -> Tuple[float, Dict]:
        """
        Predict employee growth score
        
        Args:
            employee_data: Dict containing employee features
            
        Returns:
            growth_score: Predicted growth score (0-100)
            explanation: Dict with feature contributions
        """
        if self.growth_model is None:
            raise Exception("Growth model not loaded")
        
        X = self.prepare_features(employee_data, self.growth_features)
        growth_score = self.growth_model.predict(X)[0]
        
        # Get feature importances
        importances = self.growth_model.feature_importances_
        contributions = {
            feature: float(importance * 100)
            for feature, importance in zip(self.growth_features, importances)
        }
        
        return float(growth_score), contributions
    
    def predict_promotion_readiness(self, employee_data: Dict) -> Tuple[float, str, Dict]:
        """
        Predict promotion readiness
        
        Args:
            employee_data: Dict containing employee features
            
        Returns:
            probability: Promotion probability (0-100)
            category: Readiness category
            explanation: Dict with feature contributions
        """
        if self.promotion_model is None:
            raise Exception("Promotion model not loaded")
        
        X = self.prepare_features(employee_data, self.promotion_features)
        probability = self.promotion_model.predict_proba(X)[0][1] * 100
        
        # Determine category
        if probability >= 75:
            category = "READY"
        elif probability >= 60:
            category = "NEAR_READY"
        elif probability >= 40:
            category = "DEVELOPING"
        else:
            category = "HIGH_RISK"
        
        # Get feature importances
        importances = self.promotion_model.feature_importances_
        contributions = {
            feature: float(importance * 100)
            for feature, importance in zip(self.promotion_features, importances)
        }
        
        return float(probability), category, contributions
    
    def simulate_growth(self, employee_data: Dict, modifications: Dict) -> Dict:
        """
        Simulate growth with modified factors
        
        Args:
            employee_data: Current employee data
            modifications: Dict of factors to modify
            
        Returns:
            Dict with current and projected scores
        """
        # Current prediction
        current_growth, _ = self.predict_growth(employee_data)
        current_promo, _, _ = self.predict_promotion_readiness(employee_data)
        
        # Apply modifications
        modified_data = employee_data.copy()
        modified_data.update(modifications)
        
        # New prediction
        projected_growth, _ = self.predict_growth(modified_data)
        projected_promo, _, _ = self.predict_promotion_readiness(modified_data)
        
        return {
            'current_growth_score': round(current_growth, 1),
            'projected_growth_score': round(projected_growth, 1),
            'current_promotion_readiness': round(current_promo, 1),
            'projected_promotion_readiness': round(projected_promo, 1),
            'improvement': round(projected_growth - current_growth, 1)
        }


# Example usage
if __name__ == "__main__":
    predictor = GrowthPredictor()
    
    # Test employee data
    test_employee = {
        'years_of_experience': 5.0,
        'performance_score': 85.0,
        'skill_score': 80.0,
        'learning_score': 75.0,
        'leadership_score': 70.0,
        'growth_score': 80.0,
        'department_id': 1,
        'role_level': 3
    }
    
    # Test predictions
    growth, growth_contrib = predictor.predict_growth(test_employee)
    print(f"Predicted Growth Score: {growth:.1f}")
    print(f"Contributions: {growth_contrib}")
    
    promo, category, promo_contrib = predictor.predict_promotion_readiness(test_employee)
    print(f"\nPromotion Readiness: {promo:.1f}% ({category})")
    print(f"Contributions: {promo_contrib}")
