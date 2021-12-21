provider "aws" {
  profile = "default"
  region = "us-west-1"
}
#
# resource "aws_iam_user" "johnshenk" {
#   name = "johnshenk"
# }

#bucket
resource "aws_s3_bucket" "falseheather" {
  bucket = "falseheather.john-shenk.com"
  acl    = "public-read"
  force_destroy = false
  website {
    index_document = "index.html"
    error_document = "index.html"
    routing_rules = <<EOF
[{
"Condition": {
    "KeyPrefixEquals": "music"
},
"Redirect": {
    "ReplaceKeyPrefixWith": "/"
}
}]
EOF
  }
}

resource "aws_s3_bucket_policy" "falseheather" {
  bucket = "${aws_s3_bucket.falseheather.id}"
  policy = <<EOF
{
  "Version":"2012-10-17",
  "Statement":[
    {"Sid":"PublicReadForGetBucketObjects",
      "Effect":"Allow","Principal":"*",
      "Action":"s3:GetObject",
      "Resource":"arn:aws:s3:::falseheather.john-shenk.com/*"
    }]
}
EOF
}

# cloudfront
locals {
  s3_origin_id = "S3-Website-falseheather.john-shenk.com.s3-website-us-west-1.amazonaws.com"
}

resource "aws_cloudfront_distribution" "s3_distribution" {
  origin {
    domain_name = "${aws_s3_bucket.falseheather.website_endpoint}"
    origin_id   = "${local.s3_origin_id}"

    custom_origin_config {
      http_port = "80"
      https_port= "443"
      origin_protocol_policy = "http-only"
      origin_ssl_protocols = ["TLSv1", "TLSv1.1", "TLSv1.2"]
      origin_read_timeout = 30
    }
  }

  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"
  price_class         = "PriceClass_200"

  aliases = ["falseheather.john-shenk.com","falseheather.com"]

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "${local.s3_origin_id}"

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    compress               = true
    min_ttl                = 0
    default_ttl            = 86400
    max_ttl                = 31536000
  }

  custom_error_response {
    error_code = 404
    response_code = 200
    response_page_path = "/index.html"
  }

  restrictions {
    geo_restriction {
      restriction_type = "whitelist"
      locations        = ["US", "CA"]
    }
  }

  tags = {
    Environment = "production"
  }

  viewer_certificate {
    acm_certificate_arn = "arn:aws:acm:us-east-1:671958020402:certificate/6122c262-ba9b-4c3f-8f74-0ce7f2d7a59c"
    ssl_support_method = "sni-only"
    minimum_protocol_version = "TLSv1.1_2016"
  }
}

resource "aws_route53_record" "falseheatherjs" {
  zone_id = "Z3P68RXJ4VECYX"
  name    = "falseheather.john-shenk.com"
  type    = "A"

  alias {
    name                   = "${aws_cloudfront_distribution.s3_distribution.domain_name}"
    zone_id                = "${aws_cloudfront_distribution.s3_distribution.hosted_zone_id}"
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "falseheather" {
  zone_id = "Z03149182QR849W96X1YF"
  name    = "falseheather.com"
  type    = "A"

  alias {
    name                   = "${aws_cloudfront_distribution.s3_distribution.domain_name}"
    zone_id                = "${aws_cloudfront_distribution.s3_distribution.hosted_zone_id}"
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "wwwfalseheather" {
  zone_id = "Z03149182QR849W96X1YF"
  name    = "www.falseheather.com"
  type    = "A"

  alias {
    name                   = "${aws_cloudfront_distribution.s3_distribution.domain_name}"
    zone_id                = "${aws_cloudfront_distribution.s3_distribution.hosted_zone_id}"
    evaluate_target_health = false
  }
}


# backend
terraform {
  backend "s3" {
    bucket = "remotebackend"
    key    = "falseheather/terraform.tfstate"
    region = "us-west-1"
    profile = "default"
  }
}

data "terraform_remote_state" "falseheather" {
  backend = "s3"
  config = {
    bucket  = "remotebackend"
    key     = "falseheather/terraform.tfstate"
    region  = "us-west-1"
    profile = "default"
  }
}
