export interface PackageJSON {
    name: String;
    version: String;
    description: String;
    files: String[];
    author: {
        name: string;
        email: string;
    };
    contributors: String;
    license: String;
    private: Boolean;
    dependencies: {
        ["rsi.protocol"]: String;
    };
}
