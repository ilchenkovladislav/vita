import { useState, useEffect } from "react";

import { Popover, RadioGroup } from "@headlessui/react";
import { CiSettings } from "react-icons/ci";

import "./PageSettings.scss";
import API from "../../services/API";

export function PageSettings({ pageId }) {
  const [colorScheme, setColorScheme] = useState(null);

  useEffect(() => {
    API.getPageTheme(pageId).then((theme) => {
      if (!theme) return;
      setColorScheme(theme);
    });
  }, [pageId]);

  function onChangeColorScheme(value) {
    if (!value) return;
    setColorScheme(value);
    API.setPageSettings(pageId, { theme: value });
  }

  return (
    <Popover className="relative">
      <Popover.Button>
        <CiSettings />
      </Popover.Button>

      <Popover.Panel className="pageSettings">
        <div className="pageSettings__bg-colors">
          <RadioGroup value={colorScheme} onChange={onChangeColorScheme}>
            <RadioGroup.Label className="pageSettings__title">
              Цветовая схема:
            </RadioGroup.Label>
            <RadioGroup.Option value="light">
              {({ checked }) => (
                <span
                  className={
                    checked
                      ? "pageSettings__item pageSettings__item--checked"
                      : "pageSettings__item"
                  }
                >
                  Светлая
                </span>
              )}
            </RadioGroup.Option>
            <RadioGroup.Option value="dark">
              {({ checked }) => (
                <span
                  className={
                    checked
                      ? "pageSettings__item pageSettings__item--checked"
                      : "pageSettings__item"
                  }
                >
                  Темная
                </span>
              )}
            </RadioGroup.Option>
          </RadioGroup>
        </div>
      </Popover.Panel>
    </Popover>
  );
}
