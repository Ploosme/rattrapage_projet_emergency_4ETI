package Feu.gestion_vehicule.service.dto;

import java.util.ArrayList;
import java.util.List;

public class routeDto {
	private List routes;
	private List waypoints;
	
	public routeDto() {
		routes = new ArrayList();
		waypoints = new ArrayList();
	}

	public List getRoutes() {
		return routes;
	}

	public void setRoutes(List routes) {
		this.routes = routes;
	}
}
