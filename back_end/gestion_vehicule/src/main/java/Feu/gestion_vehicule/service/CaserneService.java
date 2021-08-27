package Feu.gestion_vehicule.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import Feu.gestion_vehicule.repository.CaserneRepository;
import Feu.gestion_vehicule.model.Caserne;

@Service
public class CaserneService {
	@Autowired
	CaserneRepository caserneRepository;

	CaserneService() {

	}

	public Caserne getCaserne(int id) {
		Optional<Caserne> hOpt = caserneRepository.findById(id);
		if (hOpt.isPresent()) {
			return hOpt.get();
		}
		return null;
	}

	public List<Caserne> getAllCaserne() {
		List<Caserne> result = new ArrayList<Caserne>();
		caserneRepository.findAll().forEach(result::add);
		return result;
	}

}