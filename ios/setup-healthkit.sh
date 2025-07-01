#!/bin/bash
echo "Setting up HealthKit for Codemagic build..."

# Add HealthKit framework to project
sed -i '' 's/PRODUCT_BUNDLE_IDENTIFIER = com.medicureon.app;/PRODUCT_BUNDLE_IDENTIFIER = com.medicureon.app;\
				CODE_SIGN_ENTITLEMENTS = App\/App.entitlements;/g' ios/App/App.xcodeproj/project.pbxproj

echo "HealthKit setup complete"