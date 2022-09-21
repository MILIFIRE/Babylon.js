/* eslint-disable @typescript-eslint/naming-convention */
import type { Nullable } from "core/types";
import type { Material } from "core/Materials/material";
import { PBRMaterial } from "core/Materials/PBR/pbrMaterial";

import type { IMaterial } from "../glTFLoaderInterfaces";
import type { IGLTFLoaderExtension } from "../glTFLoaderExtension";
import { GLTFLoader } from "../glTFLoader";

const NAME = "MSFT_sRGBFactors";

/** @internal */
export class MSFT_sRGBFactors implements IGLTFLoaderExtension {
    public readonly name = NAME;
    public enabled: boolean;

    private _loader: GLTFLoader;

    constructor(loader: GLTFLoader) {
        this._loader = loader;
        this.enabled = this._loader.isExtensionUsed(NAME);
    }

    public dispose() {
        (this._loader as any) = null;
    }

    public loadMaterialPropertiesAsync(context: string, material: IMaterial, babylonMaterial: Material): Nullable<Promise<void>> {
        return GLTFLoader.LoadExtraAsync<boolean>(context, material, this.name, (extraContext, extra) => {
            if (extra) {
                if (!(babylonMaterial instanceof PBRMaterial)) {
                    throw new Error(`${extraContext}: Material type not supported`);
                }

                const promise = this._loader.loadMaterialPropertiesAsync(context, material, babylonMaterial);

                if (!babylonMaterial.albedoTexture) {
                    babylonMaterial.albedoColor.toLinearSpaceToRef(babylonMaterial.albedoColor);
                }

                if (!babylonMaterial.reflectivityTexture) {
                    babylonMaterial.reflectivityColor.toLinearSpaceToRef(babylonMaterial.reflectivityColor);
                }

                return promise;
            }

            return null;
        });
    }
}

GLTFLoader.RegisterExtension(NAME, (loader) => new MSFT_sRGBFactors(loader));
