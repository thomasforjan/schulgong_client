#!/bin/bash
INPUT=$(grep -E 'version[[:space:]]*\=[[:space:]]*' version)
RELEASEVERSION=$(echo $INPUT | cut -d "=" -f 2 | cut -d "'" -f 2)
RELEASEVERSION=$((RELEASEVERSION + 1))
# Assign the filename
filename="version"
# Assign the input version from build.gradle file
version=$INPUT
# Assign new version
newVersion="version=$RELEASEVERSION"

# Replace version with newVersion in "build.gradle"
sed -i -e "s/$version/$newVersion/g" $filename
echo v$RELEASEVERSION
