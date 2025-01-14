-------------------------------------------------------------------------------------------
-- TerraME - a software platform for multiple scale spatially-explicit dynamic modeling.
-- Copyright (C) 2001-2017 INPE and TerraLAB/UFOP -- www.terrame.org

-- This code is part of the TerraME framework.
-- This framework is free software; you can redistribute it and/or
-- modify it under the terms of the GNU Lesser General Public
-- License as published by the Free Software Foundation; either
-- version 2.1 of the License, or (at your option) any later version.

-- You should have received a copy of the GNU Lesser General Public
-- License along with this library.

-- The authors reassure the license terms regarding the warranties.
-- They specifically disclaim any warranties, including, but not limited to,
-- the implied warranties of merchantability and fitness for a particular purpose.
-- The framework provided hereunder is on an "as is" basis, and the authors have no
-- obligation to provide maintenance, support, updates, enhancements, or modifications.
-- In no event shall INPE and TerraLAB / UFOP be held liable to any party for direct,
-- indirect, special, incidental, or consequential damages arising out of the use
-- of this software and its documentation.
--
-------------------------------------------------------------------------------------------

-- @example Implementation of a simple Application using Prodes data
-- from a WMS.

import("gis")
import("publish")

local file = File("prodes.tview")
local baseproj = {title = "Prodes", file = file, clean = true}

local basemap = "amazon:"
local service = "http://35.198.39.192/geoserver/wms"

local layers = {"prodes_2000", "prodes_2005", "prodes_2010", "prodes_2015"}

file:deleteIfExists()
local proj = Project(baseproj)
forEachElement(layers, function(_, name)
	Layer{
		project = proj,
		service = service,
		name = name,
		map = basemap..name
	}
end)

Application{
	key = "AIzaSyA1coAth-Bo7m99rnxOm2oOBB88AmaSbOk",
	project = proj,
	base = "terrain",
	prodes = View{
		title = "Prodes",
		description = "Monitoring of the Amazon Rainforest by Satellite.",
		color = {"#FF0000"},
		label = {"Prodes"},
		time = "snapshot"
	}
}

file:deleteIfExists()
