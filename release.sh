#!/usr/bin/env bash

set -x
set -e

AUTOMATION_DIR="`pwd`/../tmp-package-automation"
PACKAGE_DIR="`pwd`/package"
npm run build:package
rm -Rf $AUTOMATION_DIR
mkdir $AUTOMATION_DIR
cd $AUTOMATION_DIR
git clone git@github.com:hmrc/hmrc-frontend.git
cd hmrc-frontend
git checkout package-latest
ls | xargs rm -R
cp -R ${PACKAGE_DIR}/* .
git add -A .
git commit -am "Automated package release."
git push
cd "${PACKAGE_DIR}/.."
rm -Rf $AUTOMATION_DIR

set +x

echo ""
echo "Completed release to https://github.com/hmrc/hmrc-frontend/tree/package-latest"
echo ""
