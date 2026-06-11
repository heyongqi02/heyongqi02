import { nodeLib } from "@bjmhe/viteplus-preset";

export default nodeLib(
  {},
  {
    pack: {
      exports: {
        bin: true,
      },
    },
  },
);
