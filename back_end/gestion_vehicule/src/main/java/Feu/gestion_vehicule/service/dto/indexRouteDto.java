package Feu.gestion_vehicule.service.dto;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class indexRouteDto {
	private String weight_name;
	private Integer weight;
	private Integer duration;
	private Integer distance;
	private List legs;
	private Map geometry;
	
	public indexRouteDto() {
		weight_name= "auto";
	    weight =0;
	    duration= 0;
	    distance= 1;
	    legs = new ArrayList();
	    geometry = new HashMap<>();
	}
}
