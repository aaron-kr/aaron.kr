import React from 'react';

const Admin = () => {
	return (
		<div>
		<ul>
			<li><i className="fa fa-battery-three-quarters"></i> Energy
				<ul>
					<li><i className="fa fa-ghost"></i> Spiritual</li>
					<li><i className="fa fa-dumbbell"></i> Physical</li>
					<li><i className="fa fa-brain"></i> Mental</li>
					<li><i className="fa fa-smile"></i> Emotional</li>
				</ul>
			</li>
			<li><i className="fa fa-infinity"></i> Effort
				<ul>
					<li><i className="fa fa-briefcase"></i> Career</li>
					<li><i className="fa fa-users"></i> Social</li>
					<li><i className="fa fa-ring"></i> Marital</li>
					<li><i className="fa fa-baby-carriage"></i> Parental</li>
				</ul>
			</li>
			<li><i className="fa fa-receipt"></i> Results
				<ul>
					<li><i className="fa fa-hand-holding-usd"></i> Financial</li>
					<li><i className="fa fa-umbrella-beach"></i> Recreational</li>
				</ul>
			</li>
		</ul>

		<i className="fa fa-expand"></i>
		</div>
	)
}

export default Admin;