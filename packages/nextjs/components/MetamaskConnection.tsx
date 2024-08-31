import { AddressInfoDropdown } from "./scaffold-eth/RainbowKitCustomConnectButton/AddressInfoDropdown";
// import { WrongNetworkDropdown } from "./scaffold-eth/RainbowKitCustomConnectButton/WrongNetworkDropdown";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useTargetNetwork } from "~~/hooks/scaffold-eth";
import { getBlockExplorerAddressLink } from "~~/utils/scaffold-eth";

interface Props {
  metamaskConnected: boolean;
  setMetamaskConnected: (value: boolean) => void;
  setnewtworKaddress: (value: string) => void;
  setStep: (value: number) => void;
}

const MetamaskConnection = ({ metamaskConnected, setMetamaskConnected, setnewtworKaddress, setStep }: Props) => {
  const { targetNetwork } = useTargetNetwork();
  console.log(targetNetwork);

  return (
    <>
      <ConnectButton.Custom>
        {({ account, chain, openConnectModal, mounted }) => {
          const connected = mounted && account && chain;
          const blockExplorerAddressLink = account
            ? getBlockExplorerAddressLink(targetNetwork, account.address)
            : undefined;

          if (!connected) {
            return (
              <>
                <button
                  className=" bg-carina-light text-[20px] text-white w-[270px] h-[50px]  rounded-2xl font-bold"
                  onClick={openConnectModal}
                >
                  connect
                </button>
              </>
            );
          } else if (connected) {
            setnewtworKaddress(account.address);

            setMetamaskConnected(true);
            return (
              <div className="flex flex-col gap-5">
                <AddressInfoDropdown
                  address={account.address}
                  displayName={account.displayName}
                  ensAvatar={account.ensAvatar}
                  blockExplorerAddressLink={blockExplorerAddressLink}
                />
                {metamaskConnected && (
                  <button
                    className="py-3 btn bg-primary h-[50px] text-[20px] font-bold hover:bg-black text-white rounded-2xl"
                    onClick={() => setStep(2)}
                  >
                    Continue
                  </button>
                )}
              </div>
            );
          } else {
            return <button></button>;
          }
        }}
      </ConnectButton.Custom>
    </>
  );
};
export default MetamaskConnection;
