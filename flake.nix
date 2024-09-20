{
  description = "Monorepo that I use for a bunch of stuff";

  inputs = {
    alejandra = {
      url = "github:kamadorueda/alejandra/3.0.0";
    };
    nixpkgs.url = "https://flakehub.com/f/NixOS/nixpkgs/0.1.*.tar.gz";
  };

  outputs = {
    nixpkgs,
    self,
    ...
  }: let
    supportedSystems = ["x86_64-linux" "aarch64-linux" "x86_64-darwin" "aarch64-darwin"];
    forEachSupportedSystem = f:
      nixpkgs.lib.genAttrs supportedSystems (system:
        f {
          pkgs = import nixpkgs {
            inherit system;
            overlays = [self.overlays.default];
          };
        });
  in {
    overlays.default = final: prev: rec {
      nodejs = prev.nodejs;
      yarn = prev.yarn.override {inherit nodejs;};
    };

    devShells = forEachSupportedSystem ({pkgs}: {
      default = pkgs.mkShell {
        packages = with pkgs; [
          neo-cowsay
          # better-sqlite3 has no prebuilt binaries for Node.js 22.8.0, so we
          # need to build the binary using node-gyp.
          nodejs_22
          nodePackages.node-gyp
          # In Python 3.12 the distutils module has been removed. That's why we
          # want Python 3.11 in this project.
          # https://stackoverflow.com/questions/77251296/distutils-not-found-when-running-npm-install
          python311Full
          python311Packages.setuptools
          yarn
        ];
        shellHook = ''
          cowthink "Welcome to this nix dev shell!" --bold -f tux --rainbow
          echo "Versions:"
          echo "- Node.js $(node --version)"
          echo "- node-gyp $(node-gyp --version)"
          echo "- $(python --version)"

          export SA_FIRESTORE_USER_TEST=$(cat /run/secrets/prj-kitchen-sink/sa-firestore-user-test);
          export SA_FIRESTORE_VIEWER_TEST=$(cat /run/secrets/prj-kitchen-sink/sa-firestore-viewer-test);
          export SA_NOTIFIER=$(cat /run/secrets/prj-kitchen-sink/sa-notifier);
          export SA_SECRET_MANAGER_ADMIN_TEST=$(cat /run/secrets/prj-kitchen-sink/sa-secret-manager-admin-test);
          export TELEGRAM=$(cat /run/secrets/telegram/personal_bot);
        '';
        DEBUG = "scripts/*,utils/*";
        POLLY_MODE = "record";
        # POLLY_MODE = "replay";
      };
    });
  };
}
