// Generated by CoffeeScript 1.6.3
var Aperture, CanvasRange, CornerReflector, Find2ndMin, FindCrossPoint, FindSame, HRPlane, HTPlane, Lens, Lenses, LightRay, NormalCoordinate, NormalMatrix, Plane, Point, PointOrigin, Propagate, Rectangle, ResolveLightRay, createLine, createPoint, drawPoint, elements, getAngle, getDistance, logging, r,
  __slice = [].slice,
  _this = this;

elements = {};

Lenses = [];

logging = function() {
  var a, b;
  a = arguments[0], b = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
  return console.log(a, b);
};

Point = (function() {
  function Point(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  return Point;

})();

CanvasRange = {
  x: 1024,
  y: 768,
  z: 1024
};

PointOrigin = new Point(0, 1000, 0);

NormalMatrix = $M([[1, 0, 0, PointOrigin.x], [0, -1, 0, PointOrigin.y], [0, 0, -1, PointOrigin.z], [0, 0, 0, 1]]);

Vector.prototype.homoToUnit3D = function() {
  return this.add($V([0, 0, 0, -1])).toUnitVector().add($V([0, 0, 0, 1]));
};

Rectangle = (function() {
  function Rectangle(PointLT, PointRB) {
    this.PointLT = PointLT;
    this.PointRB = PointRB;
  }

  return Rectangle;

})();

Lens = (function() {
  function Lens(PointCenter, VectorDirection) {
    this.PointCenter = PointCenter;
    this.VectorDirection = VectorDirection;
    this.VectorDirection = this.VectorDirection.toUnitVector();
  }

  return Lens;

})();

Aperture = (function() {
  function Aperture(PointCenter, VectorDirection, VectorX, Passing) {
    this.PointCenter = PointCenter;
    this.VectorDirection = VectorDirection;
    this.VectorX = VectorX;
    this.Passing = Passing;
    this.VectorDirection = this.VectorDirection.toUnitVector();
    this.VectorX = this.VectorX.toUnitVector();
    this.Type = "Aperture";
  }

  return Aperture;

})();

HRPlane = (function() {
  function HRPlane(PointCenter, VectorDirection) {
    this.PointCenter = PointCenter;
    this.VectorDirection = VectorDirection;
    this.VectorDirection = this.VectorDirection.toUnitVector();
    this.Type = "HRPlane";
  }

  return HRPlane;

})();

HTPlane = (function() {
  function HTPlane(PointCenter, VectorDirection, n2) {
    this.PointCenter = PointCenter;
    this.VectorDirection = VectorDirection;
    this.n2 = n2;
    this.VectorDirection = this.VectorDirection.toUnitVector();
    this.Type = "HTPlane";
  }

  return HTPlane;

})();

LightRay = (function() {
  function LightRay(PointStart, VectorDirection, Name) {
    this.PointStart = PointStart;
    this.VectorDirection = VectorDirection;
    this.Name = Name;
    this.Intensity = 1;
    this.VectorDirection = this.VectorDirection.toUnitVector();
  }

  return LightRay;

})();

NormalCoordinate = (function() {
  function NormalCoordinate(PointOrigin) {
    this.PointOrigin = PointOrigin;
  }

  return NormalCoordinate;

})();

CornerReflector = (function() {
  function CornerReflector(PointCenter, VectorDirection, VectorSurface, a, n) {
    var _VectorAuxiliary, _VectorHR1, _VectorHR2;
    this.PointCenter = PointCenter;
    this.VectorDirection = VectorDirection;
    this.VectorSurface = VectorSurface;
    this.a = a;
    this.n = n;
    this.VectorDirection = this.VectorDirection.toUnitVector();
    this.VectorSurface = this.VectorSurface.toUnitVector();
    this.Type = "CornerReflector";
    this.HT = new HTPlane(this.PointCenter.add(this.VectorDirection.multiply(Math.sqrt(1 / 3) * this.a)), this.VectorDirection, this.n);
    this.HRs = [];
    this.HRs.push(new HRPlane(this.PointCenter, this.VectorSurface));
    logging(_VectorAuxiliary = this.VectorSurface.subtract(this.VectorDirection.multiply(Math.sqrt(1 / 3))));
    _VectorHR1 = _VectorAuxiliary.rotate(Math.PI / 3 * 2, $L([0, 0, 0], this.VectorDirection)).add(this.VectorDirection.multiply(Math.sqrt(1 / 3)));
    _VectorHR2 = _VectorAuxiliary.rotate(-Math.PI / 3 * 2, $L([0, 0, 0], this.VectorDirection)).add(this.VectorDirection.multiply(Math.sqrt(1 / 3)));
    this.HRs.push(new HRPlane(this.PointCenter, _VectorHR1));
    this.HRs.push(new HRPlane(this.PointCenter, _VectorHR2));
  }

  return CornerReflector;

})();

createPoint = function(pos, name, fathers, parameters) {
  var father, _fn, _i, _len,
    _this = this;
  if ((elements[name] != null)) {
    console.log("duplicated");
    return -1;
  }
  elements[name] = {
    "type": "point",
    "name": name,
    "x": pos[0],
    "y": pos[1],
    "fathers": fathers,
    "children": [],
    "parameters": parameters
  };
  _fn = function(father) {
    if (elements[father] != null) {
      return elements[father]["children"].push(name);
    } else {
      return alert("cannot find element:" + father);
    }
  };
  for (_i = 0, _len = fathers.length; _i < _len; _i++) {
    father = fathers[_i];
    _fn(father);
  }
  return drawPoint(name);
};

drawPoint = function(name) {
  var child, generateStr, obj, pt, _i, _len, _ref, _results,
    _this = this;
  obj = elements[name];
  pt = null;
  if ($("#" + name).length === 0) {
    generateStr = "<svg id=\"" + obj.name + "\" class=\"svgPoint\" >\n<rect x=\"0\" y=\"0\" width=\"1\" height=\"1\" class=\"rectPoint\" />\n</svg>";
    pt = $(generateStr).appendTo($("body")[0]);
  } else {
    pt = $("#" + name);
  }
  pt.css("left", obj["x"]());
  pt.css("top", obj["y"]());
  _ref = obj["children"];
  _results = [];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    child = _ref[_i];
    _results.push((function(child) {
      if (elements[child]["type"] === "point") {
        return drawPoint(child);
      } else if (elements[child]['type'] === "line") {
        return drawLine(child);
      }
    })(child));
  }
  return _results;
};

createLine = function(start, end, name, parameters) {
  var father, _fn, _i, _len, _ref,
    _this = this;
  if (parameters == null) {
    parameters = {};
  }
  if ((elements[name] != null)) {
    alert("line name duplicated");
    return -1;
  }
  elements[name] = {
    "type": "line",
    "name": name,
    "start": start,
    "end": end,
    "fathers": [start, end],
    "parameters": parameters
  };
  _ref = elements[name]["fathers"];
  _fn = function(father) {
    if (elements[father] != null) {
      return elements[father]["children"].push(name);
    } else {
      return alert("cannot find element:" + father);
    }
  };
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    father = _ref[_i];
    _fn(father);
  }
  return drawLine(name);
};

getDistance = function(point1, point2) {
  return Math.sqrt((Math.pow(point2.x - point1.x, 2)) + (Math.pow(point2.y - point1.y, 2)));
};

getAngle = function(point1, point2) {
  var temp;
  temp = Math.atan2(point2.y - point1.y, point2.x - point1.x);
  return temp / Math.PI * 180;
};

FindCrossPoint = function(ray, lense) {
  console.log("Start finding the crossing point!");
  switch (lense.Type) {
    case "Aperture":
      console.log("Aperture!");
      if (ray.VectorDirection.dot(lense.VectorDirection) === 0) {
        return null;
      } else {
        return ray.PointStart.subtract(ray.VectorDirection.multiply(lense.VectorDirection.dot(ray.PointStart.subtract(lense.PointCenter)) / lense.VectorDirection.dot(ray.VectorDirection)));
      }
      break;
    case "HRPlane":
    case "HTPlane":
      console.log("HRPlane or HTPlane!");
      if (ray.VectorDirection.dot(lense.VectorDirection) === 0) {
        logging("the lightRay is parallel to the HRPlane");
        return null;
      } else if ((ray.PointStart.subtract(lense.PointCenter)).dot(lense.VectorDirection) === 0) {
        logging("the start point of the lightray is already on the plane!");
        return ray.PointStart;
      } else {
        logging("normal case");
        return ray.PointStart.subtract(ray.VectorDirection.multiply(lense.VectorDirection.dot(ray.PointStart.subtract(lense.PointCenter)) / lense.VectorDirection.dot(ray.VectorDirection)));
      }
  }
};

Propagate = function(ray, lense) {
  var done, plane, _2ndMin, _VectorPropagate, _VectorPropagateS, _VectorPropagateT, _count, _crossPoint, _direction, _distance, _distanceAlong, _distanceSliced, _duplicateIndex, _duplicateNumber, _i, _incidentAngle, _index, _intersectPoint, _j, _len, _len1, _n, _newDirection, _next, _planeGroup, _propagateAngle, _ray, _ref;
  logging("Start calculating for the derived lightray");
  switch (lense.Type) {
    case "HRPlane":
      logging("HRPlane");
      _crossPoint = FindCrossPoint(ray, lense);
      if (_crossPoint === null) {
        logging("No intersect...");
        return [ray];
      } else {
        logging("Seems there is a crossing point...As it is a HRPlane, only one new light ray will be generated");
        _newDirection = lense.VectorDirection.multiply(-2 * ray.VectorDirection.dot(lense.VectorDirection)).add(ray.VectorDirection);
        return new LightRay(_crossPoint, _newDirection, ray.Name + "+");
      }
      break;
    case "HTPlane":
      logging("HTPlane");
      _crossPoint = FindCrossPoint(ray, lense);
      if (_crossPoint === null) {
        logging("No intersect...");
        return [ray];
      } else {
        logging("Seems there is a crossing point...As it is a HTPlane, only one new light ray will be generated");
        _incidentAngle = lense.VectorDirection.angleFrom(ray.VectorDirection);
        logging(_incidentAngle);
        if (_incidentAngle > Math.PI / 2) {
          _direction = true;
          _incidentAngle = Math.PI - _incidentAngle;
        } else {
          _direction = false;
        }
        logging(_direction);
        _n = _direction ? lense.n2 : 1 / lense.n2;
        if (Math.sin(_incidentAngle) / _n > 1) {
          logging("Full internal reflection detected, not to be solved until next version");
          return null;
        } else {
          _propagateAngle = Math.asin(Math.sin(_incidentAngle) / _n);
          if (_propagateAngle > 0) {
            _VectorPropagateT = ray.VectorDirection.add(lense.VectorDirection.multiply(-lense.VectorDirection.dot(ray.VectorDirection)));
            _VectorPropagateS = lense.VectorDirection.multiply((_direction ? -1 : 1) * _VectorPropagateT.modulus() / Math.tan(_propagateAngle));
            _VectorPropagate = _VectorPropagateT.add(_VectorPropagateS);
          } else {
            _VectorPropagate = ray.VectorDirection;
          }
          return new LightRay(_crossPoint, _VectorPropagate, ray.Name + "#");
        }
      }
      break;
    case "CornerReflector":
      logging("CornerReflector...WTF");
      _crossPoint = FindCrossPoint(ray, lense.HT);
      if (_crossPoint === null) {
        logging("No intersection, Hmmm...");
        return [ray];
      } else {
        logging("Seems the lightray enters the CR, now Trying to find the HR plane it will intersect with");
        _ray = Propagate(ray, lense.HT);
        done = false;
        _planeGroup = lense.HRs;
        _planeGroup.push(lense.HT);
        _count = 0;
        while (!done && _count < 4) {
          _count = _count + 1;
          _distance = [];
          for (_i = 0, _len = _planeGroup.length; _i < _len; _i++) {
            plane = _planeGroup[_i];
            logging(plane, _ray);
            _intersectPoint = FindCrossPoint(_ray, plane);
            logging(_intersectPoint);
            _distanceAlong = _intersectPoint.subtract(_ray.PointStart).dot(_ray.VectorDirection);
            console.log(_distanceAlong);
            _distance.push(_distanceAlong > -Sylvester.precision ? _distanceAlong : Infinity);
          }
          logging(_distance);
          _2ndMin = Find2ndMin(_distance);
          _distanceSliced = _distance.slice(0);
          while (Math.abs(_2ndMin) < Sylvester.precision) {
            logging("the second smallest distance is zero, that's not we wanted");
            _distanceSliced = _distanceSliced.sort().slice(1);
            _2ndMin = Find2ndMin(_distanceSliced);
          }
          logging(_2ndMin);
          _ref = FindSame(_distance, _2ndMin, 1e-9), _duplicateNumber = _ref[0], _duplicateIndex = _ref[1];
          if (_duplicateNumber === 1) {
            _next = _distance.indexOf(_2ndMin);
            logging(_next);
            if (_planeGroup[_next].Type === "HTPlane") {
              logging("The lightray is about to leave the CR...I Hope...");
              done = true;
            } else {
              logging("The lightray is still in the CR...Hmmm...");
              _ray = Propagate(_ray, _planeGroup[_next]);
            }
          } else if ((1 < _duplicateNumber && _duplicateNumber <= 3)) {
            logging("_duplicateNumber > 1,which is " + _duplicateNumber);
            for (_j = 0, _len1 = _duplicateIndex.length; _j < _len1; _j++) {
              _index = _duplicateIndex[_j];
              if (_index === 3) {
                logging("..., seems the lightray is about to leave the CR from a edge ...");
                done = true;
              } else {
                _ray = Propagate(_ray, _planeGroup[_index]);
              }
            }
          } else {
            logging("strange duplicate number, T-T", _duplicateNumber);
          }
        }
        return Propagate(_ray, lense.HT);
      }
  }
};

ResolveLightRay = function(ray) {
  var crossPoints, lense, _i, _len, _results;
  crossPoints = [];
  _results = [];
  for (_i = 0, _len = Lenses.length; _i < _len; _i++) {
    lense = Lenses[_i];
    _results.push(crossPoints.push(FindCrossPoint(ray, lense)));
  }
  return _results;
};

Plane = (function() {
  function Plane(name, VectorDirection, PointPassing) {
    this.name = name;
    this.VectorDirection = VectorDirection;
    this.PointPassing = PointPassing;
  }

  return Plane;

})();

r = null;

Find2ndMin = function(arr) {
  var val, _1, _2, _i, _len, _ref;
  _1 = arr[0];
  _2 = Infinity;
  _ref = arr.slice(1);
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    val = _ref[_i];
    if ((_1 < val && val < _2)) {
      _2 = val;
    } else if (val <= _1) {
      _2 = _1;
      _1 = val;
    }
  }
  return _2;
};

FindSame = function(arr, element, err) {
  var e, k, _count, _i, _index, _len;
  _count = 0;
  _index = [];
  for (k = _i = 0, _len = arr.length; _i < _len; k = ++_i) {
    e = arr[k];
    if (Math.abs(e - element) < err) {
      _count = _count + 1;
      _index.push(k);
    }
  }
  return [_count, _index];
};

$(function() {
  var CR1, HR1, HR2, HRPlane1, HTPlane1, LR4, LR5, LR6, LR7, LightRay1, LightRay2, LightRay3;
  Sylvester.precision = 1e-9;
  window.test1 = new LightRay($V([0, 0, 0]), $V([1, 1, 0]), "LRtest1");
  window.aperture1 = new Aperture($V([100, 0, 0]), $V([-1, 0, 0]), $V([0, 0, 1]), (function(x, y) {
    if (x * x + y * y > 20 * 20) {
      return false;
    } else {
      return true;
    }
  }));
  Lenses.push(aperture1);
  HRPlane1 = new HRPlane($V([1, 1, 0]), $V([-1, -1, 0]));
  HTPlane1 = new HTPlane($V([1, 1, 0]), $V([1, 1, 0]), 1.5);
  LightRay1 = new LightRay($V([0, 0, 0]), $V([1, 1, 1]), "LRtest2");
  r = new CornerReflector($V([0, 0, 0]), $V([1, 1, 1]), $V([1, 0, 0]), 1, 1.5);
  LightRay2 = new LightRay($V([0, 0, 0]), $V([-1, -1, -1]), "LRtestCR");
  LightRay3 = new LightRay($V([0, 0, 0]), $V([1, 0, 0]), "LRbottom");
  HR1 = new HRPlane($V([5, 0, 0]), $V([-1, 0, -1]));
  HR2 = new HRPlane($V([5, 0, -5]), $V([1, 0, 1]));
  logging(CR1 = new CornerReflector($V([10, 0, -5.5]), $V([-1, 0, 0]), $V([-1, 0, Math.sqrt(2)]), 2, 1.5));
  logging(LR4 = Propagate(LightRay3, HR1));
  logging(LR5 = Propagate(LR4, HR2));
  logging(LR6 = Propagate(LR5, CR1));
  return logging(LR7 = Propagate(LR6, HR2));
});

/*
//@ sourceMappingURL=core.map
*/
