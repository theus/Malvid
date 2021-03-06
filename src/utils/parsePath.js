'use strict'

const UrlPattern = require('url-pattern')

const createNavigation = require('../utils/createNavigation')
const getComponent = require('../selectors/getComponent')
const getTab = require('../selectors/getTab')
const getTabs = require('../selectors/getTabs')

const pattern = new UrlPattern('/(:componentId(/:tabId))')

module.exports = (path, components) => {

	const hasComponents = components.length > 0

	if (hasComponents === false) return {
		componentId: null,
		tabId: null
	}

	// Params is null when path is invalid so we use an object as fallback
	const params = pattern.match(path) || {}
	const componentId = params.componentId
	const tabId = params.tabId

	// Use the specified or the first component depending on what's available
	const hasComponentId = getComponent(components, componentId) != null
	const firstComponentId = createNavigation(components, '').firstComponent().id
	const nextComponentId = hasComponentId === true ? componentId : firstComponentId

	// Get data of the next component and check if it has the specified tab
	const nextComponent = getComponent(components, nextComponentId)
	const hasTabId = getTab(nextComponent, tabId) != null

	// Use the specified or the first tab depending on what's available
	const nextTabId = hasTabId === true ? tabId : getTabs(nextComponent)[0].id

	return {
		componentId: nextComponentId,
		tabId: nextTabId
	}

}