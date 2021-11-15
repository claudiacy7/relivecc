import "./style/css/style.css";
import Stage from "./Stage";
import axios from "axios";
import { Player, Kit } from "../shared/sharedModels";

//this also needs to have a storage location in an external json file for example to temporary collect the data 
//as this now restarts the bikes movement from the start whenever the caching is reset
type Cache =
{
    result: {
        startPosition: number;
        name: string;
        kit: Kit;
    }[],
    numReq: number
};

var cache: Cache = {
    result: [], 
    numReq: 0
}

async function getPlayersFromServer() {
    const players = await axios.get<Player[]>("http://localhost:4000/players");
    const positions = await axios.get<
        Array<{ name: string; position: number }>
    >("http://localhost:4000/positions");

    const playersWithScore = players.data.map(player => {
        return {
            ...player,
            startPosition: positions.data.find(
                position => position.name === player.name
            )!.position
        };
    });

    return playersWithScore;
}

function getSamplePlayers() {
    return [
        {
            kit: "FDJ" as Kit,
            name: "Test player",
            startPosition: 1
        }
    ];
}

async function renderToContainer() {
    const root = document.getElementById("root")!;

    root.innerHTML = "";

    
    var players: {
        startPosition: number;
        name: string;
        kit: Kit;
    }[];
    if(cache.numReq > 0 && cache.numReq < 10) {
         players = cache.result;
         cache.numReq++;
    }
    else {
        players = await getPlayersFromServer();
    }

    //reset the cache after 10 requests
    if(cache.numReq >= 10) {
        cache.result = [];
        cache.numReq = 0;
    }

    const stage = new Stage(root, {
        maxPosition: 10000,
        players: players
    });

    stage.moveCamera(0, 0);
    (window as any).stage = stage;

    stage.renderWithProps({}); // initial render
}

renderToContainer().then(() => console.log("initialized"), console.error);
