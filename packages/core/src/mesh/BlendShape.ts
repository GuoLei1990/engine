import { BlendShapeFrame } from "./BlendShapeFrame";
import { Vector3 } from "@oasis-engine/math";
import { UpdateFlag } from "../UpdateFlag";
import { UpdateFlagManager } from "../UpdateFlagManager";

/**
 * BlendShape.
 */
export class BlendShape {
  /** Name of BlendShape. */
  name: string;

  /** @internal */
  _useBlendShapeNormal: boolean = false;
  /** @internal */
  _useBlendShapeTangent: boolean = false;

  private _frames: BlendShapeFrame[] = [];
  private _updateFlagManager: UpdateFlagManager = new UpdateFlagManager();

  /**
   * Frames of BlendShape.
   */
  get frames(): Readonly<BlendShapeFrame[]> {
    return this._frames;
  }

  /**
   * Create a BlendShape.
   * @param name - BlendShape name.
   */
  constructor(name: string) {
    this.name = name;
  }

  /**
   * Add a BlendShapeFrame.
   * @param frame - The BlendShapeFrame.
   */
  addFrame(frame: BlendShapeFrame): void;

  /**
   * Add a BlendShapeFrame by weight, deltaPositions, deltaNormals and deltaTangents.
   * @param weight - Weight of BlendShapeFrame
   * @param deltaPositions - Delta positions for the frame being added
   * @param deltaNormals - Delta normals for the frame being added
   * @param deltaTangents - Delta tangents for the frame being added
   */
  addFrame(
    weight: number,
    deltaPositions: Vector3[],
    deltaNormals: Vector3[] | null,
    deltaTangents: Vector3[] | null
  ): BlendShapeFrame;

  addFrame(
    frameOrWeight: BlendShapeFrame | number,
    deltaPositions?: Vector3[],
    deltaNormals?: Vector3[] | null,
    deltaTangents?: Vector3[] | null
  ): void | BlendShapeFrame {
    //CM: 一帧法线为空，一帧不为空
    const frames = this._frames;
    if (typeof frameOrWeight === "number") {
      const frame = new BlendShapeFrame(frameOrWeight, deltaPositions, deltaNormals, deltaTangents);
      this._checkSupportNormalAndTangent(frame);
      frames.push(frame);
      return frame;
    } else {
      this._checkSupportNormalAndTangent(frameOrWeight);
      frames.push(frameOrWeight);
    }
    this._updateFlagManager.distribute();
  }

  /**
   * Clear all frames.
   */
  clearFrames(): void {
    this._frames.length = 0;
    this._updateFlagManager.distribute();
    this._useBlendShapeNormal = false;
    this._useBlendShapeTangent = false;
  }

  /**
   * @internal
   */
  _registerChangeFlag(): UpdateFlag {
    return this._updateFlagManager.register();
  }

  private _checkSupportNormalAndTangent(frame: BlendShapeFrame): void {
    this._useBlendShapeNormal =
      frames.length === 0 ? frame.deltaNormals !== null : this._useBlendShapeNormal && frame.deltaNormals !== null;
    this._useBlendShapeTangent =
      frames.length === 0 ? frame.deltaTangents !== null : this._useBlendShapeTangent && frame.deltaTangents !== null;
  }
}