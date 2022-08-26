<script>
import Endpoints from "../../components/common/Endpoints";
import Common from "../../components/common/Common";
import Request from "../../components/common/Request";

const instanceateAddress = (addressObj, geo) => {
  addressObj.name = "MAIN";
  if (geo.geometry.lat) {
    addressObj.lat = geo.geometry.lat;
  } else return null;
  if (geo.geometry.lng) {
    addressObj.lng = geo.geometry.lng;
  } else return null;

  return addressObj;
};

export default {
  init: (payload) => {
    const el = document.body;
    el.removeAttribute("class");
    $(".modal").modal("hide");
    payload.getHubs();
    payload.listCompanies();
  },
  methods: {
    save: function () {
      this.errors = [];
      this.messageIdToast = null;

      let state = this;
      let data = JSON.parse(JSON.stringify(this.data));

      if (data.company) {
        data.company = data.company._id;
      }

      if (data.address && data.address._id) {
        delete data.address._id;
      }

      if (data.types && data.types.length > 0) {
        let copytypes = data.types;
        let types = [];
        for (let i = 0; i < copytypes.length; i++) {
          if (copytypes[i] && copytypes[i]._id) types.push(copytypes[i]._id);
        }
        data.types = types;
      }

      if (data.hubs && data.hubs.length > 0) {
        let copyHubs = data.hubs;
        let hubs = [];
        for (let i = 0; i < copyHubs.length; i++) {
          if (copyHubs[i] && copyHubs[i]._id) hubs.push(copyHubs[i]._id);
        }
        data.hubs = hubs;
      }

      Request.do(
        this,
        this.data._id ? "PUT" : "POST",
        Request.getDefaultHeader(this),
        data,
        `${Endpoints.pointHubs.pointHub}${this.data._id ? this.data._id : ""}`,
        (pointHub) => {
          //SUCCESS CALLBACK
          this.errors = [];
          this.$eventHub.$emit("refreshList");
          this.$fire({
            text: this.data._id
              ? this.$t("str.register.put.sucess")
              : this.$t("string.user.register.success"),
            type: "success",
            timer: 2000,
          }).then((r) => {
            this.data._id = pointHub.result._id;
          });
        },
        (error) => {
          //ERROR CALLBACK
          let res = error.response;
          if (res && res.status) {
            this.titleToast = this.$t("string.msg.warning");
            if (res.data.messageId === "response.msg.error.empty.fields") {
              let fields = "";
              res.data.errors.forEach(function (value) {
                fields += state.$t(value.id) + ";<br/>";
              });
              this.titleToast = this.$t(res.data.messageId);
              this.messageToast = this.$t(fields);
            } else if (res.data.messageId === "response.already.exists") {
              this.messageToast = this.$t("response.company.already.exists");
            } else {
              this.messageToast = this.$t(res.data.messageId);
              this.messageIdToast = res.data.messageId;
            }

            $("#toast").modal("show");
          }
        }
      );
    },
    listCompanies: function () {
      this.companies = [];
      Request.do(
        this,
        "GET",
        Request.getDefaultHeader(this),
        null,
        `${Endpoints.companies.company}`,
        (response) => {
          //SUCCESS CALLBACK
          this.companies = response.results;
        },
        (error) => {
          //ERROR CALLBACK
        }
      );
    },
    isAdminMaster: function () {
      let user = this.$session.get("user");
      if (user) {
        return user.companyUser && user.companyUser.subtype == "ADMIN_MASTER";
      }
      return false;
    },
    customLabelCompany(option) {
      return `${this.toUpperCase(option.fantasyName)}`;
    },
    getHubs: function () {
      Request.do(
        this,
        "POST",
        Request.getDefaultHeader(this),
        { status: "ACTIVE" },
        `${Endpoints.hubs.filter}`,
        (hubsReponse) => {
          //SUCCESS CALLBACK
          this.hubs = hubsReponse.results;
          console.log(this.hubs);
        },
        (error) => {
          //ERROR CALLBACK
          $("#toast").modal("show");
        }
      );
    },
    retirarLista: function (index) {
      this.data.hubs.splice(index, 1);
    },
    selectAddress: function (index) {
      let addressObj = instanceateAddress(
        this.data.address,
        this.addresses[index]
      );
      if (addressObj) {
        addressObj.ibge = this.data.address.ibge;
        addressObj.gia = this.data.address.gia;
        addressObj.complement = this.data.complement;
        this.data.address = addressObj;
        $("#modalListAddress").modal("toggle");
        this.save(this.data);
      } else {
        this.errors = [];

        this.errors.push(this.$t("string.company.register.address.invalid"));
        $("#modalListAddress").modal("toggle");
      }
    },
    archive: function (response) {
      if (response == 1) {
        this.errors = [];
        this.messageIdToast = null;
        let state = this;

        Request.do(
          this,
          "DELETE",
          Request.getDefaultHeader(this),
          null,
          `${Endpoints.pointHubs.pointHub}${this.data._id}`,
          (companyResponse) => {
            //SUCCESS CALLBACK
            his.$eventHub.$emit("refreshList");
            this.$fire({
              text: this.$t("str.point.delete.sucess"),
              type: "success",
              timer: 2000,
            }).then((r) => {});
          },
          (error) => {
            //ERROR CALLBACK
            let res = error.response;
            if (res && res.status) {
              this.titleToast = this.$t("string.msg.warning");
              if (res.data.messageId === "response.msg.error.empty.fields") {
                let fields = "";
                res.data.errors.forEach(function (value) {
                  fields += state.$t(value.id) + ";<br/>";
                });
                this.titleToast = this.$t(res.data.messageId);
                this.messageToast = this.$t(fields);
              } else {
                this.messageToast = this.$t(res.data.messageId);
                this.messageIdToast = res.data.messageId;
              }
              $("#toast").modal("show");
            }
          }
        );
      }
    },
    confirmArchive: function () {
      this.titleToast = this.$t("string.msg.confirm");
      this.messageToast = this.$t("response.archive.point.confirmation");
      this.cancelText = this.$t("string.msg.cancel");
      this.yesText = this.$t("string.msg.yes");
      $("#confirmationModal").modal("show");
    },
    loadInfosByCEP: function () {
      let state = this;
      if (this.data.address.cep && this.data.address.cep.length == 9) {
        $("#spinner").modal("toggle");
        Request.do(
          this,
          "GET",
          {},
          {},
          `${Endpoints.cep.find}${this.data.address.cep}/json`,
          (response) => {
            //SUCCESS CALLBACK
            if (response) {
              state.data.address.address = response.logradouro;
              state.data.address.neighborhood = response.bairro;
              state.data.address.city = response.localidade;
              state.data.address.state = response.uf;
              state.data.address.ibge = response.ibge;
              state.data.address.gia = response.gia;
            }

            $("#spinner").modal("toggle");
          },
          (error) => {
            //ERROR CALLBACK
            $("#spinner").modal("toggle");
          }
        );
      }
    },
    loadGeolocation: function (callbackSuccess, callbackError) {
      let state = this;
      Request.do(
        this,
        "POST",
        Request.getDefaultHeader(this),
        this.data.address,
        `${Endpoints.addresses.geolocation}`,
        (geoResponse) => {
          //SUCCESS CALLBACK
          console.log("geoResponse", geoResponse);
          if (geoResponse.results.length == 0) {
            return callbackError(
              this.$t("string.company.register.address.invalid")
            );
          } else if (geoResponse.results.length == 1) {
            let geo = geoResponse.results[0];
            let addressObj = instanceateAddress(state.data.address, geo);
            if (addressObj) {
              return callbackSuccess(state.data);
            } else {
              return callbackError(
                state.$t("string.company.register.address.invalid")
              );
            }
          } else if (geoResponse.results.length > 1) {
            state.addresses = geoResponse.results;
            $("#modalListAddress").modal("toggle");
          }
        },
        (error) => {
          //ERROR CALLBACK
          let res = error.response;
          if (res && res.status) {
            this.titleToast = this.$t("string.msg.warning");
            if (res.data.messageId === "response.msg.error.empty.fields") {
              let fields = "";
              res.data.errors.forEach(function (value) {
                fields += state.$t(value.id) + ";<br/>";
              });
              this.titleToast = this.$t(res.data.messageId);
              this.messageToast = this.$t(fields);
            } else if (res.data.messageId === "response.already.exists") {
              this.messageToast = this.$t("response.user.already.exists");
            } else {
              this.messageToast = this.$t(res.data.messageId);
              this.messageIdToast = res.data.messageId;
            }

            $("#toast").modal("show");
          }
        }
      );
    },
    clearForm: function () {
      this.errors = [];
      this.data = {};
      this.data.address = {};
      this.latitude = Number(-13.053232);
      this.longitude = Number(-37.615482);
    },
    checkForm: function (e) {
      this.errors = [];
      if (!this.data.name) {
        this.errors.push(this.$t("response.user.register.name.required"));
      }
      if (!this.data.types) {
        this.errors.push(this.$t("response.user.register.point.type.required"));
      }
      if (!this.data.address.cep) {
        this.errors.push(this.$t("response.address.register.cep.required"));
      }
      if (this.data.address.state == -1) {
        this.errors.push(
          this.$t("response.address.register.city.state.required")
        );
      }
      if (!this.data.address.city) {
        this.errors.push(this.$t("response.address.register.city.required"));
      }
      if (!this.data.address.neighborhood) {
        this.errors.push(
          this.$t("response.address.register.neighborhood.required")
        );
      }
      if (!this.data.address.address) {
        this.errors.push(this.$t("response.address.register.address.required"));
      }
      if (!this.data.address.number) {
        this.errors.push(this.$t("response.address.register.number.required"));
      }

      if (this.errors.length > 0) {
        e.preventDefault();
      } else {
        if (
          this.data.address &&
          this.data.address.cep &&
          this.data.address.cep.length == 9
        ) {
          this.loadGeolocation(
            (newData) => {
              this.errors = [];
              this.save(newData);
            },
            (error) => {
              this.errors.push(error);
            }
          );
        } else {
          this.data.address = null;
          this.errors = [];
          this.save();
        }
      }
    },
    selectItem: function (item) {
      this.data = JSON.parse(JSON.stringify(item));
      if (
        this.data.address &&
        this.data.address.location &&
        this.data.address.location.coordinates
      ) {
        this.latitude = this.data.address.location.coordinates[1];
        this.longitude = this.data.address.location.coordinates[0];
      }

      if (
        this.data.address &&
        this.data.address.cep &&
        this.data.address.cep.length == 9
      ) {
        this.data.address.cep = this.data.address.cep;
        this.data.address.state = this.toUpperCase(this.data.address.state);
        this.data.address.address = this.camelize(this.data.address.address);
        this.data.address.city = this.camelize(this.data.address.city);
        this.data.address.neighborhood = this.camelize(
          this.data.address.neighborhood
        );
        if (this.data.address._id) {
          delete this.data.address._id;
        }
      } else {
        this.data.address = JSON.parse(
          JSON.stringify({
            state: -1,
            cep: null,
            city: null,
            address: null,
            neighborhood: null,
            number: null,
            complement: null,
          })
        );
      }

      if (this.data.types && this.data.types.length > 0) {
        let types = [];
        this.data.types.forEach((item) => {
          types.push({ _id: item });
        });
        this.data.types = types;
      }

      // console.log(this.data);
      document.body.scrollTop = 0; // For Safari
      document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    },
    customLabelPontHubs(option) {
      return `${this.$t(option._id)}`;
    },
    customLabelHubs(option) {
      return `${this.$t(option.name)}`;
    },
    camelize: Common.camelize,
    toUpperCase: Common.toUpperCase,
  },
};
</script>