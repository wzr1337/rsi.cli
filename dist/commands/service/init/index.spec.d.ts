export interface PackageJSON {
    name: String;
    version: String;
    description: String;
    files: String[];
    author: String;
    contributors: String;
    license: String;
    private: Boolean;
    dependencies: {
        ["rsi.protocol"]: String;
    };
}
