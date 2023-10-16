import { useState, useEffect } from 'react';

import { Popover, RadioGroup } from '@headlessui/react';
import { CiSettings } from 'react-icons/ci';

import './PageSettings.scss';
import API from '../../services/API';

import { Page } from '../../store/types.ts';

interface PageSettingsProps {
    page: Page;
}

export function PageSettings({ page }: PageSettingsProps) {
    const { theme, id } = page;
    const [colorScheme, setColorScheme] = useState(null);
    const [isCreated, setIsCreated] = useState(false);

    useEffect(() => {
        setColorScheme(theme);
    }, [theme]);

    function onChangeColorScheme(value) {
        if (!value) return;
        setColorScheme(value);
        if (theme || isCreated) {
            API.updatePageSettings(id, { theme: value });
        } else {
            API.createPageSettings(id, { theme: value });
            setIsCreated(true);
        }
    }

    return (
        <Popover className="relative">
            <Popover.Button>
                <CiSettings size={20} />
            </Popover.Button>

            <Popover.Panel className="pageSettings">
                <div className="pageSettings__bg-colors">
                    <RadioGroup
                        value={colorScheme}
                        onChange={onChangeColorScheme}
                    >
                        <RadioGroup.Label className="pageSettings__title">
                            Цветовая схема:
                        </RadioGroup.Label>
                        <RadioGroup.Option value="light">
                            {({ checked }) => (
                                <span
                                    className={
                                        checked
                                            ? 'pageSettings__item pageSettings__item--checked'
                                            : 'pageSettings__item'
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
                                            ? 'pageSettings__item pageSettings__item--checked'
                                            : 'pageSettings__item'
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
