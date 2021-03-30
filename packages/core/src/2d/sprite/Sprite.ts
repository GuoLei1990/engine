import { Rect, Vector2 } from "@oasis-engine/math";
import { RefObject } from "../../asset/RefObject";
import { Engine } from "../../Engine";
import { Texture2D } from "../../texture";

/**
 * 2D sprite.
 */
export class Sprite extends RefObject {
  private static _tempVec2: Vector2 = new Vector2();

  /** @internal */
  _triangles: number[] = [];
  /** @internal */
  _uv: Vector2[] = [new Vector2(), new Vector2(), new Vector2(), new Vector2()];
  /** @internal */
  _positions: Vector2[] = [new Vector2(), new Vector2(), new Vector2(), new Vector2()];

  private _texture: Texture2D = null;
  private _atlasRect: Rect = new Rect();
  private _pivot: Vector2 = new Vector2();
  private _rect: Rect = new Rect();
  private _pixelsPerUnit: number = 100;
  private _dirtyFlag: number = DirtyFlag.all;

  /**
   * The reference to the used texture.
   */
  get texture(): Texture2D {
    return this._texture;
  }

  set texture(value: Texture2D) {
    if (this._texture !== value) {
      this._texture = value;
    }
  }

  /**
   * The rectangle of the original texture on its atlas texture.
   */
  get atlasRect(): Rect {
    return this._atlasRect;
  }

  set atlasRect(value: Rect) {
    if (this._atlasRect !== value) {
      this._atlasRect.x = value.x;
      this._atlasRect.y = value.y;
      this._atlasRect.width = value.width;
      this._atlasRect.height = value.width;
    }
  }

  /**
   * Location of the sprite's center point in the rect on the original texture, specified in pixels.
   */
  get pivot(): Vector2 {
    return this._pivot;
  }

  set pivot(value: Vector2) {
    if (this._pivot !== value) {
      value.cloneTo(this._pivot);
      this._setDirtyFlagTrue(DirtyFlag.positions);
    }
  }

  /**
   * Location of the sprite on the original texture, specified in pixels.
   */
  get rect(): Rect {
    return this._rect;
  }

  set rect(value: Rect) {
    if (this._rect !== value) {
      this._rect.x = value.x;
      this._rect.y = value.y;
      this._rect.width = value.width;
      this._rect.height = value.width;
      this._setDirtyFlagTrue(DirtyFlag.positions);
    }
  }

  /**
   * The number of pixels in the sprite that correspond to one unit in world space.
   */
  get pixelsPerUnit(): number {
    return this._pixelsPerUnit;
  }

  set pixelsPerUnit(value: number) {
    if (this._pixelsPerUnit !== value) {
      this._pixelsPerUnit = value;
      this._setDirtyFlagTrue(DirtyFlag.positions);
    }
  }

  /**
   * Constructor a sprite.
   * @param engine - Engine to which the sprite belongs
   * @param texture - Texture from which to obtain the sprite
   * @param rect - Rectangular section of the texture to use for the sprite
   * @param normalizedPivot - Sprite's normalized pivot point relative to its graphic rectangle
   * @param pixelsPerUnit - The number of pixels in the sprite that correspond to one unit in world space
   */
  constructor(
    engine: Engine,
    texture: Texture2D,
    rect: Rect = null,
    normalizedPivot: Vector2 = null,
    pixelsPerUnit: number = 100
  ) {
    super(engine);

    const rectangle = this.rect;
    if (rect) {
      rect.cloneTo(rectangle);
      if (rectangle.x + rectangle.width > texture.width || rectangle.y + rectangle.height > texture.height) {
        throw new Error("rect out of range");
      }
    } else {
      rectangle.setValue(0, 0, texture.width, texture.height);
    }

    if (normalizedPivot) {
      this.pivot.setValue(normalizedPivot.x * rectangle.width, normalizedPivot.y * rectangle.height);
    } else {
      this.pivot.setValue(0.5 * rectangle.width, 0.5 * rectangle.height);
    }

    rectangle.cloneTo(this.atlasRect);
    this.texture = texture;
    this.pixelsPerUnit = pixelsPerUnit;
  }

  /**
   * @override
   */
  _onDestroy(): void {
    if (this._texture) {
      this._texture = null;
    }
  }

  /**
   * Update mesh.
   */
  private _updateMesh(): void {
    const { _pixelsPerUnit, _pivot, _positions, _uv, _triangles } = this;
    const unitPivot = Sprite._tempVec2;

    if (this._isContainDirtyFlag(DirtyFlag.positions)) {
      const { width, height } = this._rect;

      const pixelsPerUnitReciprocal = 1.0 / _pixelsPerUnit;
      // Get the pivot coordinate in 3D space.
      Vector2.scale(_pivot, pixelsPerUnitReciprocal, unitPivot);
      // Get the width and height in 3D space.
      const unitWidth = width * pixelsPerUnitReciprocal;
      const unitHeight = height * pixelsPerUnitReciprocal;

      // Top-left.
      _positions[0].setValue(-unitPivot.x, unitHeight - unitPivot.y);
      // Top-right.
      _positions[1].setValue(unitWidth - unitPivot.x, unitWidth - unitPivot.y);
      // Bottom-right.
      _positions[2].setValue(unitWidth - unitPivot.x, -unitPivot.y);
      // Bottom-left.
      _positions[3].setValue(-unitPivot.x, -unitPivot.y);
    }

    if (this._isContainDirtyFlag(DirtyFlag.uv)) {
      // Top-left.
      _uv[0].setValue(0, 0);
      // Top-right.
      _uv[1].setValue(1, 0);
      // Bottom-right.
      _uv[2].setValue(1, 1);
      // Bottom-left.
      _uv[3].setValue(0, 1);
    }

    if (this._isContainDirtyFlag(DirtyFlag.triangles)) {
      _triangles[0] = 0;
      _triangles[1] = 2;
      _triangles[2] = 1;
      _triangles[3] = 2;
      _triangles[4] = 0;
      _triangles[5] = 3;
    }
  }

  /**
   * @internal
   * Update mesh data of the sprite.
   * @returns True if the data is refreshed, false otherwise.
   */
  _updateMeshData(): boolean {
    if (this._isContainDirtyFlag(DirtyFlag.all)) {
      this._updateMesh();
      this._setDirtyFlagFalse(DirtyFlag.all);

      return true;
    }

    return false;
  }

  private _isContainDirtyFlag(type: number): boolean {
    return (this._dirtyFlag & type) != 0;
  }

  private _setDirtyFlagTrue(type: number): void {
    this._dirtyFlag |= type;
  }

  private _setDirtyFlagFalse(type: number): void {
    this._dirtyFlag &= ~type;
  }
}

enum DirtyFlag {
  positions = 0x1,
  uv = 0x2,
  triangles = 0x4,
  all = 0x7
}