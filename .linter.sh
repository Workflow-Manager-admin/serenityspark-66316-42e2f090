#!/bin/bash
cd /home/kavia/workspace/code-generation/serenityspark-66316-42e2f090/serenityspark
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

