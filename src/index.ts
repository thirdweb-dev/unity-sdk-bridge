import { ThirdwebSDK, ValidProviderInput } from "@3rdweb/sdk";
import { v4 } from "uuid";

export class ThirdwebUnityBridge extends ThirdwebSDK {
  constructor(validProviderInput: ValidProviderInput) {
    super(validProviderInput);

    // initialize thirdweb unity sdk
    const w = window as any;
    w.unity = {};
    w.unity.invoke = (route: string, payload: string) => {
      console.log("invoke called", route, payload);
      const ack_id = v4();
      // invoking the sdk route
      this.invokeRoute(route, JSON.parse(payload)).then((result: any) => {
        console.log("invoke route result", result);
        const returnPayload = JSON.stringify({ ack_id, result });
        w.unityInstance.SendMessage("Thirdweb", "Callback", returnPayload);
      });
      return ack_id;
    };
  }
}
