
echo -n "
Chose action:
 1 : Start all
 2 : Start test-db
 3 : Terminate all
 4 : Logs for Api
 5 : Logs for Client
 6 : build All
 7 : Quit
"

read -p "Enter number: " action

case  $action in
      1)
        echo -n "starting all the dev services:
        "
        ./helpers-build/start-dev.sh
        ;;
      2)
        echo -n "starting the test db:
        "
        ./helpers-build/start-test-db-dev.sh
        ;;
      3)
        echo -n "down all services:
        "
        ./helpers-build/down-dev.sh
        ;;
      4)
        echo -n "Logs for API:
        "
        ./helpers-build/logs-api.sh
        ;;
      5)
        echo -n "Logs for clients:
        "
        ./helpers-build/logs-client.sh
        ;;
      6)
        echo -n "Logs for clients:
        "
        ./helpers-build/build-dev.sh
        ;;
      *)
esac
