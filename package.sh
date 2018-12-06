#!/bin/sh -e
LAMBDAS=$1

npx webpack --env.lambdas=${LAMBDAS}

bundle_dir="build/bundle/"
artifact_dir="build/artifacts/"
version_num=$(jq -r '.version' < package.json | cut -d . -f 1,2).$(date +%s)
git_rev=$(git rev-parse --short HEAD)

mkdir -p ${artifact_dir}
for func_dir in src/functions/*; do
  func_name=$(basename ${func_dir})
  bundle_path="${bundle_dir}${func_name}.js"
  zip_filename="${func_name}-${version_num}-${git_rev}.zip"
  zip_path="${artifact_dir}${zip_filename}"
  zip -Xj ${zip_path} ${bundle_path}
  echo "LAMBDA ARTIFACT: ${bundle_path} => ${zip_path}"
done

if [ -d coverage ]; then
  coverage_filename="journal-coverage-${version_num}-${git_rev}.zip"
  coverage_path="${artifact_dir}${coverage_filename}"
  zip ${coverage_path} coverage
  echo "COVERAGE ARTIFACT: coverage => ${coverage_path}"
else
  echo "No coverage report found"
fi
