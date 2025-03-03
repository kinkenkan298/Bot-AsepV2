/** @jsx JSX.createElement */
/** @jsxFrag JSX.Fragment */

import { Builder, Font, FontFactory, JSX, loadImage } from "canvacord";

const pathFonts = `${process.cwd()}/assets/fonts`;

interface Props {
  displayName: string;
  avatar: string;
  message: string;
  title: string;
  background?: string;
}

export default class WelcomeChannel extends Builder<Props> {
  constructor() {
    super(700, 350);
    Font.fromFileSync(
      `${pathFonts}/Poppins/Poppins-Regular.ttf`,
      "PoppinsRegular",
    );
    Font.fromFileSync(`${pathFonts}/Poppins/Poppins-Bold.ttf`, "PoppinsBold");
    if (!FontFactory.size) Font.loadDefault();
    this.bootstrap({
      displayName: "",
      avatar: "",
      title: "",
      message: "",
      background: "",
    });
  }

  setTitle(value: string) {
    this.options.set("title", value);
    return this;
  }
  setDisplayName(value: string) {
    this.options.set("displayName", value);
    return this;
  }

  setAvatar(value: string) {
    this.options.set("avatar", value);
    return this;
  }

  setMessage(value: string) {
    this.options.set("message", value);
    return this;
  }

  setBackground(value: string) {
    this.options.set("background", value);
    return this;
  }

  override async render() {
    const { displayName, avatar, message, title } = this.options.getOptions();

    const image = await loadImage(avatar);

    return <h1>{ message } </h1>;
  }
}
