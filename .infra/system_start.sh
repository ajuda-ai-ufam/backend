#!/bin/bash

echo 'Iniciando servidor'

echo 'Matando nginx'

kill $(ps aux | grep '[n]ginx' | awk '{print $2}')

echo 'Subindo backend'

cd /home/hiago_leda/supermonitoria/backend

make restart-prod

echo 'Reiniciando apache'

make apache-restart

echo 'Done'
