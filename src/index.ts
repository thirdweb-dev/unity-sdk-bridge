import { ISDKOptions, ThirdwebSDK, ValidProviderInput } from "@3rdweb/sdk";
import { v4 } from "uuid";

export class ThirdwebBridgeSDK extends ThirdwebSDK {
  constructor(
    providerOrNetwork: ValidProviderInput,
    opts?: Partial<ISDKOptions>
  ) {
    super(providerOrNetwork, opts);

    // initialize thirdweb bridge sdk
    const w = window as any;
    w.bridge = {};
    w.bridge.invoke = (route: string, payload: string) => {
      console.log("invoke called", route, payload);
      const ack_id = v4();
      // invoking the sdk route
      this.invokeRoute(route, JSON.parse(payload)).then((result: any) => {
        console.log("invoke route result", result);
        const returnPayload = JSON.stringify({ ack_id, result });

        // note: can let user pass in any SendMessage
        // for now this only work with our unity sdk
        w.unityInstance.SendMessage("Thirdweb", "Callback", returnPayload);
      });
      return ack_id;
    };
  }
}
