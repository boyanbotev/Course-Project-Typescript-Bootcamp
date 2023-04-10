import { Manager } from "./common/manager";
import { LoaderScene } from "./scenes/loaderScene";

Manager.initialize(1600, 900, 0xFFFFFF);

const loaderScene = new LoaderScene();
Manager.changeScene(loaderScene);
