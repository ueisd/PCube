
echo -n "
Chose action:
 1 : Start all
 2 : Terminate all
 3 : Logs for Api
 4 : Quit
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
        echo -n "down all services:
        "
        ./helpers-build/logs-api.sh
        ;;
      *)
esac
