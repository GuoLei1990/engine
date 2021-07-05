import { Color } from "@oasis-engine/math";
import { Texture2D } from "../texture/Texture2D";
import { PBRBaseMaterialX } from "./PBRBaseMaterialX";

/**
 * PBR specular-glossiness workflow material.
 */
export class PBRSpecularMaterialX extends PBRBaseMaterialX {
  private _specularColor: Color = new Color(0.2, 0.2, 0.2, 1.0);
  private _specularGlossinessTexture: Texture2D;
  private _glossiness: number;

  /**
   * Specular color.
   */
  get specularColor(): Color {
    return this._specularColor;
  }

  set specularColor(value: Color) {
    this._specularColor = value;
  }

  /**
   * Glossiness.
   */
  get glossiness(): number {
    return this._glossiness;
  }

  set glossiness(value: number) {
    this._glossiness = value;
  }

  /**
   * Specular glossiness texture.
   * @remarks RGB is specular, A is glossiness.
   */
  get specularGlossinessTexture(): Texture2D {
    return this._specularGlossinessTexture;
  }

  set specularGlossinessTexture(value: Texture2D) {
    this._specularGlossinessTexture = value;
  }
}
