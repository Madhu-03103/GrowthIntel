"""
ML Model Training Pipeline for Employee Growth Intelligence
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.metrics import mean_squared_error, r2_score, accuracy_score, classification_report
import xgboost as xgb
import joblib
from datetime import datetime

# Import database models
from backend.app.core.database import SessionLocal
from backend.app.models import Employee

def load_employee_data():
    """Load employee data from database"""
    db = SessionLocal()
    
    try:
        employees = db.query(Employee).filter(Employee.is_active == 1).all()
        
        data = []
        for emp in employees:
            data.append({
                'employee_id': emp.id,
                'years_of_experience': emp.years_of_experience,
                'performance_score': emp.performance_score,
                'skill_score': emp.skill_score,
                'learning_score': emp.learning_score,
                'leadership_score': emp.leadership_score,
                'growth_score': emp.growth_score,
                'promotion_readiness': emp.promotion_readiness,
                'department_id': emp.department_id or 0,
                'role_level': emp.role.level if emp.role else 1
            })
        
        df = pd.DataFrame(data)
        print(f"✓ Loaded {len(df)} employee records")
        return df
        
    finally:
        db.close()


def train_growth_model(df):
    """Train growth score prediction model"""
    print("\n" + "="*60)
    print("TRAINING GROWTH SCORE MODEL")
    print("="*60)
    
    # Features and target
    feature_cols = ['years_of_experience', 'performance_score', 'skill_score', 
                    'learning_score', 'leadership_score', 'department_id', 'role_level']
    X = df[feature_cols]
    y = df['growth_score']
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Train XGBoost model
    model = xgb.XGBRegressor(
        n_estimators=100,
        max_depth=5,
        learning_rate=0.1,
        random_state=42
    )
    
    print("Training model...")
    model.fit(X_train, y_train)
    
    # Evaluate
    y_pred = model.predict(X_test)
    r2 = r2_score(y_test, y_pred)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    
    print(f"\nModel Performance:")
    print(f"  R² Score: {r2:.4f}")
    print(f"  RMSE: {rmse:.4f}")
    
    # Cross-validation
    cv_scores = cross_val_score(model, X, y, cv=5, scoring='r2')
    print(f"  Cross-validation R² (mean ± std): {cv_scores.mean():.4f} ± {cv_scores.std():.4f}")
    
    # Feature importance
    feature_importance = pd.DataFrame({
        'feature': feature_cols,
        'importance': model.feature_importances_
    }).sort_values('importance', ascending=False)
    
    print("\nFeature Importance:")
    for _, row in feature_importance.iterrows():
        print(f"  {row['feature']}: {row['importance']:.4f}")
    
    # Save model
    os.makedirs('../models', exist_ok=True)
    model_path = '../models/growth_model.joblib'
    joblib.dump(model, model_path)
    print(f"\n✓ Model saved to {model_path}")
    
    return model, feature_cols


def train_promotion_model(df):
    """Train promotion readiness classification model"""
    print("\n" + "="*60)
    print("TRAINING PROMOTION READINESS MODEL")
    print("="*60)
    
    # Features and target
    feature_cols = ['years_of_experience', 'performance_score', 'skill_score', 
                    'learning_score', 'leadership_score', 'growth_score', 
                    'department_id', 'role_level']
    X = df[feature_cols]
    
    # Create classification target (promotion ready if readiness >= 75)
    y = (df['promotion_readiness'] >= 75).astype(int)
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Train XGBoost classifier
    model = xgb.XGBClassifier(
        n_estimators=100,
        max_depth=5,
        learning_rate=0.1,
        random_state=42
    )
    
    print("Training model...")
    model.fit(X_train, y_train)
    
    # Evaluate
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    
    print(f"\nModel Performance:")
    print(f"  Accuracy: {accuracy:.4f}")
    
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred, target_names=['Not Ready', 'Ready']))
    
    # Cross-validation
    cv_scores = cross_val_score(model, X, y, cv=5, scoring='accuracy')
    print(f"Cross-validation Accuracy (mean ± std): {cv_scores.mean():.4f} ± {cv_scores.std():.4f}")
    
    # Save model
    model_path = '../models/promotion_model.joblib'
    joblib.dump(model, model_path)
    print(f"\n✓ Model saved to {model_path}")
    
    return model, feature_cols


def save_model_metadata(growth_metrics, promo_metrics):
    """Save model training metadata"""
    metadata = {
        'training_date': datetime.now().isoformat(),
        'growth_model': growth_metrics,
        'promotion_model': promo_metrics,
        'version': '1.0'
    }
    
    import json
    with open('../models/model_metadata.json', 'w') as f:
        json.dump(metadata, f, indent=2)
    
    print("\n✓ Model metadata saved")


def main():
    """Main training pipeline"""
    print("🤖 Employee Growth Intelligence - ML Model Training")
    print("="*60)
    
    # Load data
    df = load_employee_data()
    
    if len(df) < 50:
        print("\n⚠️  Warning: Insufficient data for training. Need at least 50 records.")
        print("   Run seed_data.py to generate demo data first.")
        return
    
    # Train models
    growth_model, growth_features = train_growth_model(df)
    promo_model, promo_features = train_promotion_model(df)
    
    # Save feature lists
    joblib.dump(growth_features, '../models/growth_features.joblib')
    joblib.dump(promo_features, '../models/promotion_features.joblib')
    
    print("\n" + "="*60)
    print("✅ MODEL TRAINING COMPLETED")
    print("="*60)
    print("\nTrained models:")
    print("  1. Growth Score Prediction Model")
    print("  2. Promotion Readiness Classification Model")
    print("\nModels saved in ml/models/")
    print("\nNext steps:")
    print("  - Integrate models with backend prediction API")
    print("  - Implement SHAP explainability")
    print("  - Test predictions on new data")


if __name__ == "__main__":
    main()
