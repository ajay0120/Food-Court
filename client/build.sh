# Build script for deployment
echo "🚀 Starting deployment build..."

# Install dependencies including dev dependencies
echo "📦 Installing dependencies..."
npm ci

# Set environment to production
export NODE_ENV=production

# Run the build
echo "🔨 Building the application..."
npx vite build

# Check if build was successful
if [ -d "dist" ]; then
    echo "✅ Build successful! Dist folder created."
    echo "📁 Build output size:"
    du -sh dist/
else
    echo "❌ Build failed! No dist folder found."
    exit 1
fi

echo "🎉 Deployment build complete!"
