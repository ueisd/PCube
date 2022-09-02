
echo -n "
Chose action:
 1 : Start all
 2 : Terminate all
 3 : Logs for Api
 4 : Logs for Client
 5 : build All
 6 : Quit
"

read -p "Enter number: " action

case  $action in
      1)
        echo -n "starting all the dev services:
        "
        ./helpers-build/start-dev.sh
        ;;
      2)
        echo -n "down all services:
        "
        ./helpers-build/down-dev.sh
        ;;
      3)
        echo -n "Logs for API:
        "
        ./helpers-build/logs-api.sh
        ;;
      4)
        echo -n "Logs for clients:
        "
        ./helpers-build/logs-client.sh
        ;;
      5)
        echo -n "Logs for clients:
        "
        ./helpers-build/build-dev.sh
        ;;
      *)
esac
