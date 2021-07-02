import { Color, Vector4 } from "@oasis-engine/math";
import { Texture2D } from "../texture/Texture2D";
import { BaseMaterial } from "./BaseMaterial";

/**
 * PBR base material.
 */
export abstract class PBRBaseMaterialX extends BaseMaterial {
  private _baseColor: Color = new Color(1, 1, 1, 1);
  private _baseTexture: Texture2D;
  private _normalTexture: Texture2D;
  private _emissiveColor: Color = new Color(0, 0, 0, 1);
  private _emissiveTexture: Texture2D;
  private _tilingOffset: Vector4 = new Vector4(1, 1, 0, 0);
  private _occlusionTexture: Texture2D;
  private _occlusionIntensity: number = 0.0;
  private _detailTilingOffset: Vector4 = new Vector4(1, 1, 0, 0);

  /**
   * Base color.
   */
  get baseColor(): Color {
    return this._baseColor;
  }

  set baseColor(value: Color) {
    if (value !== this._baseColor) {
      value.cloneTo(this._baseColor);
    }
  }

  /**
   * Base texture.
   */
  get baseTexture(): Texture2D {
    return this._baseTexture;
  }

  set baseTexture(value: Texture2D) {
    this._baseTexture = value;

    if (value) {
      this.shaderData.enableMacro("O3_DIFFUSE_TEXTURE");
      this.shaderData.setTexture("u_diffuseTexture", value);
    } else {
      this.shaderData.disableMacro("O3_DIFFUSE_TEXTURE");
    }
  }

  /**
   * Normal texture.
   */
  get normalTexture(): Texture2D {
    return this._normalTexture;
  }

  set normalTexture(value: Texture2D) {
    this._normalTexture = value;

    if (value) {
      this.shaderData.enableMacro("O3_NORMAL_TEXTURE");
      this.shaderData.setTexture("u_normalTexture", value);
    } else {
      this.shaderData.disableMacro("O3_NORMAL_TEXTURE");
    }
  }

  /**
   * Normal texture intensity.
   */
  get normalTextureIntensity(): number {
    return null;
  }

  set normalTextureIntensity(value: number) {}

  /**
   * Emissive color.
   */
  get emissiveColor(): Color {
    return this._emissiveColor;
  }

  set emissiveColor(value: Color) {
    if (value !== this._emissiveColor) {
      value.cloneTo(this._emissiveColor);
    }
  }

  /**
   * Emissive texture.
   */
  get emissiveTexture(): Texture2D {
    return this._emissiveTexture;
  }

  set emissiveTexture(value: Texture2D) {
    this._emissiveTexture = value;

    if (value) {
      this.shaderData.enableMacro("O3_EMISSIVE_TEXTURE");
      this.shaderData.setTexture("u_emissiveTexture", value);
    } else {
      this.shaderData.disableMacro("O3_EMISSIVE_TEXTURE");
    }
  }

  /**
   * Occlusion texture.
   */
  get occlusionTexture(): Texture2D {
    return this._occlusionTexture;
  }

  set occlusionTexture(v: Texture2D) {
    this._occlusionTexture = v;

    if (v) {
      this.shaderData.enableMacro("HAS_OCCLUSIONMAP");
      this.shaderData.setTexture("u_occlusionSampler", v);
    } else {
      this.shaderData.disableMacro("HAS_OCCLUSIONMAP");
    }
  }

  /**
   * Occlusion texture intensity.
   */
  get occlusionTextureIntensity(): number {
    return this._occlusionIntensity;
  }

  set occlusionTextureIntensity(v: number) {
    this._occlusionIntensity = v;
    this.shaderData.setFloat("u_occlusionStrength", v);
  }

  /**
   * Parallax texture.
   */
  get parallaxTexture(): Texture2D {
    return null;
  }

  set parallaxTexture(value: Texture2D) {}

  /**
   * Parallax texture intensity.
   */
  get parallaxTextureIntensity(): number {
    return null;
  }

  set parallaxTextureIntensity(value: number) {}

  /**
   * Tiling and offset of main textures.
   */
  get tilingOffset(): Vector4 {
    return this._tilingOffset;
  }

  set tilingOffset(value: Vector4) {
    this._tilingOffset = value;
    this.shaderData.setVector4("u_tilingOffset", value);
  }

  /**
   * Detail mask.
   */
  get detailMask(): Texture2D {
    return null;
  }

  set detailMask(value: Texture2D) {}

  /**
   * Detail texture.
   */
  get detailTexture(): Texture2D {
    return null;
  }

  set detailTexture(value: Texture2D) {}

  /**
   * Detail nromal texture.
   */
  get detailNormalTexture(): Texture2D {
    return null;
  }

  set detailNormalTexture(value: Texture2D) {}

  /**
   * Tiling and offset of detail texture.
   */
  get detailTilingOffset(): Vector4 {
    return this._detailTilingOffset;
  }

  set detailTilingOffset(value: Vector4) {
    this._detailTilingOffset = value;
  }

  /**
   * Clear coat texture.
   */
  get clearCoatTexture(): Texture2D {
    return null;
  }

  set clearCoatTexture(value: Texture2D) {}

  /**
   * Clear coat texture intensity.
   */
  get clearCoatTextureIntensity(): number {
    return null;
  }

  set clearCoatTextureIntensity(value: number) {}

  /**
   * Clear coat roughness.
   */
  get clearCoatRoughness(): number {
    return 0;
  }
  set clearCoatRoughness(value: number) {}

  /**
   * Clear coat roughness texture.
   */
  get clearCoatRoughnessTexture(): Texture2D {
    return null;
  }
  set clearCoatRoughnessTexture(value: Texture2D) {}

  /**
   * Clear coat normal texture.
   */
  get clearCoatNormalTexture(): Texture2D {
    return null;
  }
  set clearCoatNormalTexture(value: Texture2D) {}

  /**
   * Clear coat normal texture intensity.
   */
  get clearCoatNormalTextureIntensity(): Texture2D {
    return null;
  }
  set clearCoatNormalTextureIntensity(value: Texture2D) {}
}
