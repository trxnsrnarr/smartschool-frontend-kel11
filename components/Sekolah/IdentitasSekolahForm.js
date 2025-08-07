import React from "react";

const IdentitasSekolahForm = ({ settingList }) => {
  return (
    <>
      <div className="card-header p-4 card-header-ss pb-0">
        Identitas Sekolah
      </div>
      <div className="card-body p-4">
        <div className="row g-4">
          {settingList.map((setting, idx) => {
            if (setting.type == "select") {
              return (
                <div
                  className="col-md-6"
                  key={`${idx}-${new Date().getTime()}`}
                >
                  <label className="form-label">{setting.label}</label>
                  <select
                    className="form-select"
                    aria-label="Default select example"
                    name={setting.name}
                    value={setting.value}
                    onChange={setting.onChange}
                  >
                    {setting.selectOptions.map((option, idx) => {
                      return (
                        <option
                          value={option.value}
                          key={`${idx}-${new Date().getTime()}`}
                        >
                          {option.label}
                        </option>
                      );
                    })}
                  </select>
                </div>
              );
            } else if (setting.type == "checkbox") {
              return (
                <div className="col-md-6">
                  <label className="form-label">{setting.label}</label>
                  <div>
                    {setting.checkboxOptions.map((option, idx) => {
                      return (
                        <div
                          className="form-check form-check-inline"
                          key={`${idx}-${new Date().getTime()}`}
                        >
                          <input
                            className="form-check-input"
                            type="radio"
                            value={option.value}
                            id={option.value}
                            onChange={setting.onChange}
                            name={setting.name}
                          />
                          <label
                            className="form-check-label"
                            htmlFor={option.value}
                          >
                            {option.label}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            } else if (setting.type == "combobox") {
              return (
                <div className="col-md-6">
                  <label htmlFor={setting.name} className="form-label">
                    {setting.label}
                  </label>
                  <Combobox
                    data={people}
                    defaultValue={people[0]}
                    textField="name"
                    caseSensitive={false}
                    minLength={3}
                    filter="contains"
                  />
                </div>
              );
            } else if (setting.type == "textarea") {
              return (
                <div className="col-md-12">
                  <label htmlFor={setting.name} className="form-label">
                    {setting.label}
                  </label>
                  <textarea
                    className="form-control"
                    autoComplete="off"
                    id={setting.name}
                    value={setting.value}
                    onChange={setting.onChange}
                    rows="3"
                  ></textarea>
                </div>
              );
            }
            return (
              <div className="col-md-6">
                <label htmlFor={setting.name} className="form-label">
                  {setting.label}
                </label>
                <input
                  className="form-control"
                  autoComplete="off"
                  value={setting.value}
                  id={setting.name}
                  onChange={setting.onChange}
                />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default IdentitasSekolahForm;
