import { ISDKOptions, ThirdwebSDK, ValidProviderInput } from "@3rdweb/sdk";
import { v4 } from "uuid";

type SendResultFunction = (
  route: string,
  request: string,
  response: string
) => void;

export class ThirdwebBridgeSDK extends ThirdwebSDK {
  constructor(
    providerOrNetwork: ValidProviderInput,
    opts?: Partial<ISDKOptions>,
    resultFunc?: SendResultFunction
  ) {
    super(providerOrNetwork, opts);

    // initialize thirdweb bridge sdk
    const w = window as any;
    w.bridge = {};
    w.bridge.sendResult = resultFunc;
    w.bridge.invoke = (route: string, payload: string) => {
      console.log("invoke called", route, payload);
      const ack_id = v4();
      // invoking the sdk route
      this.invokeRoute(route, JSON.parse(payload)).then((result: any) => {
        console.log("invoke route result", result);
        const returnPayload = JSON.stringify({ ack_id, result });

        if (w.bridge.sendResult) {
          w.bridge.sendResult(route, payload, returnPayload);
        } else {
          // by default, we send the result back to the bridge through window.unityInstance (backward compatibility)
          w.unityInstance.SendMessage("Thirdweb", "Callback", returnPayload);
        }
      });
      return ack_id;
    };
  }
}
