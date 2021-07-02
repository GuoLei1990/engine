import { Texture2D } from "../texture/Texture2D";
import { PBRBaseMaterialX } from "./PBRBaseMaterialX";

export class PBRMaterialX extends PBRBaseMaterialX {
  private _metallic: number = 0.0;
  private _roughness: number = 0.5;
  private _metallicRoughnessTexture: Texture2D;

  /**
   * Metallic.
   */
  get metallic(): number {
    return this._metallic;
  }

  set metallic(value: number) {
    this._metallic = value;
    this.shaderData.setFloat("u_metal", value);
  }

  /**
   * Roughness.
   */
  get roughness(): number {
    return this._roughness;
  }

  set roughness(value: number) {
    this._roughness = value;
    this.shaderData.setFloat("u_roughness", value);
  }

  /**
   * Metallic roughness texture.
   */
  get metallicRoughnessTexture(): Texture2D {
    return this._metallicRoughnessTexture;
  }

  set metallicRoughnessTexture(v: Texture2D) {
    this._metallicRoughnessTexture = v;

    if (v) {
      this.shaderData.enableMacro("HAS_METALROUGHNESSMAP");
      this.shaderData.setTexture("u_metallicRoughnessSampler", v);
    } else {
      this.shaderData.disableMacro("HAS_METALROUGHNESSMAP");
    }
  }
}
