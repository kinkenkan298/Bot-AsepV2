import { Builder, Font, JSX } from "canvacord";

const pathFonts = `${process.cwd()}/assets/fonts`;

export default class WelcomeChannel extends Builder {
  constructor() {
    super(700, 350);
    Font.fromFileSync(
      `${pathFonts}/Poppins/Poppins-Regular.ttf`,
      "PoppinsRegular",
    );
    Font.fromFileSync(`${pathFonts}/Poppins/Poppins-Bold.ttf`, "PoppinsBold");
  }

  override async render() {
    return JSX.createElement(
      "div",
      {
        style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "white",
          width: "100%",
          height: "100%",
        },
      },
      JSX.createElement(
        "h1",
        {
          style: {
            fontSize: "10px",
          },
        },
        "halo",
      ),
    );
  }
}
