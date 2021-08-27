package Feu.gestion_vehicule.service.dto;

import java.util.HashMap;
import java.util.Map;



public enum LiquidTypeDto {
	//https://www.seton.fr/quel-extincteur-pour-quel-feu.html
	//TODO OPTIOMIZE EFFICIENCY MATRIX
	ALL(1.0f,1.0f,1.0f,1.0f,1.0f),
	WATER(0.8f,0.8f,0.25f,0.25f,0.25f),
	WATER_WITH_ADDITIVES(1f,1f,0.25f,0.25f,0.25f),
	CARBON_DIOXIDE(0.25f,0.25f,0.25f,0.25f,1f),
	POWDER(0.25f,0.25f,0.25f,0.1f,0.25f);
	
	private Map<String,Float> fireEfficiencyMap;
	
	LiquidTypeDto(float a_Efficiency,float b_Efficiency,float c_Efficiency,float d_Efficiency,float e_Efficiency){
		fireEfficiencyMap=new HashMap<String, Float>();
		fireEfficiencyMap.put(FireTypeDto.A.toString(),a_Efficiency);
		fireEfficiencyMap.put(FireTypeDto.B_Alcohol.toString(),b_Efficiency);
		fireEfficiencyMap.put(FireTypeDto.B_Gasoline.toString(),b_Efficiency);
		fireEfficiencyMap.put(FireTypeDto.B_Plastics.toString(),b_Efficiency);
		fireEfficiencyMap.put(FireTypeDto.C_Flammable_Gases.toString(),c_Efficiency);
		fireEfficiencyMap.put(FireTypeDto.D_Metals.toString(),d_Efficiency);
		fireEfficiencyMap.put(FireTypeDto.E_Electric.toString(),e_Efficiency);
	}
	
	public float getEfficiency(String fireType) {
		return fireEfficiencyMap.get(fireType);
	}
	
	

}







