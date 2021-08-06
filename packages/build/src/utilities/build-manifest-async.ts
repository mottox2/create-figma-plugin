import {
  ConfigCommand,
  ConfigCommandSeparator,
  ConfigParameter,
  ConfigRelaunchButton,
  constants,
  readConfigAsync
} from '@create-figma-plugin/common'
import fs from 'fs-extra'

import {
  Manifest,
  ManifestMenuItem,
  ManifestMenuItemSeparator,
  ManifestParameter,
  ManifestRelaunchButton
} from '../types/manifest.js'

export async function buildManifestAsync(minify: boolean): Promise<void> {
  const config = await readConfigAsync()
  const {
    build,
    enablePrivatePluginApi,
    enableProposedApi,
    name,
    commandId,
    main,
    ui,
    menu,
    relaunchButtons,
    parameters,
    parameterOnly
  } = config
  const command = { commandId, main, menu, name, parameterOnly, parameters, ui }
  if (hasBundle(command, 'main') === false) {
    throw new Error('Need a `main` entry point')
  }
  /* eslint-disable sort-keys-fix/sort-keys-fix */
  const result: Manifest = {
    api: config.apiVersion,
    editorType: config.editorType,
    name: config.name,
    id: config.id,
    main: constants.build.pluginCodeFilePath
  }
  /* eslint-enable sort-keys-fix/sort-keys-fix */
  if (hasBundle(command, 'ui') === true) {
    result.ui = constants.build.pluginUiFilePath
  } else {
    if (relaunchButtons !== null) {
      const relaunchButtonsWithUi = relaunchButtons.filter(function (
        relaunchButton: ConfigRelaunchButton
      ): boolean {
        return relaunchButton.ui !== null
      })
      if (relaunchButtonsWithUi.length > 0) {
        result.ui = constants.build.pluginUiFilePath
      }
    }
  }
  if (command.parameters !== null) {
    result.parameters = createParameters(command.parameters)
  }
  if (command.parameterOnly === true) {
    result.parameterOnly = true
  }
  if (command.menu !== null) {
    result.menu = createMenu(command.menu)
  }
  if (relaunchButtons !== null) {
    result.relaunchButtons = createRelaunchButtons(relaunchButtons)
  }
  if (enableProposedApi === true) {
    result.enableProposedApi = true
  }
  if (enablePrivatePluginApi === true) {
    result.enablePrivatePluginApi = true
  }
  if (build !== null) {
    result.build = build
  }
  const string =
    (minify === true
      ? JSON.stringify(result)
      : JSON.stringify(result, null, 2)) + '\n'
  await fs.outputFile(constants.build.manifestFilePath, string)
}

function hasBundle(command: ConfigCommand, key: 'main' | 'ui'): boolean {
  if (command[key] !== null) {
    return true
  }
  if (command.menu !== null) {
    const result = command.menu.filter(function (
      command: ConfigCommand | ConfigCommandSeparator
    ): boolean {
      if ('separator' in command) {
        return false
      }
      return hasBundle(command, key)
    })
    return result.length > 0
  }
  return false
}

function createParameters(
  parameters: Array<ConfigParameter>
): Array<ManifestParameter> {
  return parameters.map(function (
    parameter: ConfigParameter
  ): ManifestParameter {
    const result: ManifestParameter = {
      key: parameter.key,
      name: parameter.name
    }
    if (parameter.description !== null) {
      result.description = parameter.description
    }
    if (parameter.allowFreeform === true) {
      result.allowFreeform = true
    }
    return result
  })
}

function createMenu(
  menu: Array<ConfigCommand | ConfigCommandSeparator>
): Array<ManifestMenuItem | ManifestMenuItemSeparator> {
  return menu.map(function (
    item: ConfigCommand | ConfigCommandSeparator
  ): ManifestMenuItem | ManifestMenuItemSeparator {
    if ('separator' in item) {
      return { separator: true }
    }
    const result: ManifestMenuItem = {
      name: item.name
    }
    if (item.commandId !== null) {
      result.command = item.commandId
    }
    if (item.parameters !== null) {
      result.parameters = createParameters(item.parameters)
    }
    if (item.parameterOnly === true) {
      result.parameterOnly = true
    }
    if (item.menu !== null) {
      result.menu = createMenu(item.menu)
    }
    return result
  })
}

function createRelaunchButtons(
  relaunchButtons: Array<ConfigRelaunchButton>
): Array<ManifestRelaunchButton> {
  return relaunchButtons.map(function (
    relaunchButton: ConfigRelaunchButton
  ): ManifestRelaunchButton {
    /* eslint-disable sort-keys-fix/sort-keys-fix */
    const result: ManifestRelaunchButton = {
      name: relaunchButton.name,
      command: relaunchButton.commandId
    }
    /* eslint-enable sort-keys-fix/sort-keys-fix */
    if (relaunchButton.multipleSelection === true) {
      result.multipleSelection = true
    }
    return result
  })
}
