package Feu.gestion_vehicule.service.dto;

public enum VehicleTypeDto {
	//https://lemonbin.com/types-of-fire-trucks/
	CAR(2,2),
	FIRE_ENGINE(6,6),
	PUMPER_TRUCK(6,4),
	WATER_TENDERS(4,2), 
	TURNTABLE_LADDER_TRUCK(10,5),
	TRUCK(10,8);
	
	private int spaceUsedInFacility;
	private int vehicleCrewCapacity;
	
	private VehicleTypeDto(int spaceUsedInFacility,int vehicleCrewCapacity) {
		this.spaceUsedInFacility=spaceUsedInFacility;
		this.vehicleCrewCapacity=vehicleCrewCapacity;
	}
	
	public int getSpaceUsedInFacility() {
		return this.spaceUsedInFacility;
	}
	
	public int getVehicleCrewCapacity() {
		return this.vehicleCrewCapacity;
	}

}
